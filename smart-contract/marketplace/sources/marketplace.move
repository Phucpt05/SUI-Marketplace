module marketplace::nft_marketplace {

    // Part 1: These imports are provided by default
    // use sui::object::{Self, UID};
    // use sui::transfer;
    // use sui::tx_context::{Self, TxContext};

    use std::string::{Self, utf8};

    use sui::balance::Balance;
    use sui::coin::{Self, Coin};
    use sui::display;
    use sui::dynamic_object_field as dof;
    use sui::event;
    use sui::package;
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::url::{Self, Url};

    // This is the only dependency you need for events.
    // Use this dependency to get a type wrapper for UTF-8 strings
    // For publishing NFT
    // For displaying NFT image
    // === Errors ===

    const EInvalidAmount: u64 = 0;
    const EInvalidNft: u64 = 1;
    const EInvalidOwner: u64 = 2;
    const EListingNotFoundForNFTId: u64 = 3;
    const EBidNotFoundForNFTId: u64 = 4;

    // ====== Events ======

    public struct MarketplaceInit has copy, drop {
        object_id: ID,
    }

    public struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    public struct ListingCreated has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        price: u64,
    }

    public struct ListingCancelled has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        price: u64,
    }

    public struct Buy has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        buyer: address,
        price: u64,
    }

    public struct BidCreated has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        price: u64,
    }

    public struct BidCancelled has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        price: u64,
    }

    public struct AcceptBid has copy, drop {
        object_id: ID,
        nft_id: ID,
        creator: address,
        seller: address,
        price: u64,
    }

    // === Structs ===

    public struct TestnetNFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url,
        creator: address,
    }

    public struct Listing has key, store {
        id: UID,
        price: u64,
        owner: address,
        nft_id: ID
    }

    public struct Bid has key, store {
        id: UID,
        nft_id: ID,
        balance: Balance<SUI>,
        owner: address,
    }

    public struct Marketplace has key {
        id: UID,
        listings: Table<ID, Listing>,
        bids: Table<ID, vector<Bid>>,
    }

    // For displaying NFT image
    public struct NFT_MARKETPLACE has drop {}

    // Part 3: Module initializer to be executed when this module is published


    // === Public-View Functions ===

    /// Get the NFT's `name`
    public fun name(nft: &TestnetNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &TestnetNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &TestnetNFT): &Url {
        &nft.url
    }

    /// Get the NFT's `creator`
    public fun creator(nft: &TestnetNFT): &address {
        &nft.creator
    }

    // === Entrypoints  ===

    /// Create a new TestnetNFT
    public fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): TestnetNFT {
        let sender = ctx.sender();
        let nft = TestnetNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            creator: sender,
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        nft
    }

    /// Permanently delete `nft`
    public fun burn(nft: TestnetNFT) {
        let TestnetNFT { id, name: _, description: _, url: _, creator: _ } = nft;
        id.delete()
    }

    public fun place_listing<N: key + store>(marketplace: &mut Marketplace, nft: N, price: u64, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let nft_id = object::id(&nft);
        let listing = Listing {
            id: object::new(ctx),
            price,
            owner: sender,
            nft_id
        };

        event::emit(ListingCreated {
            object_id: object::id(&listing),
            nft_id,
            creator: sender,
            price: listing.price,
        });

        dof::add(&mut marketplace.id, nft_id, nft);

        marketplace.listings.add<ID, Listing>(nft_id, listing);
    }

    public fun cancel_listing<N: key + store>(
        marketplace: &mut Marketplace,
        nft_id: ID,
        ctx: &mut TxContext
    ): N {
        let sender = ctx.sender();
        assert!(marketplace.listings.contains<ID, Listing>(nft_id), EListingNotFoundForNFTId);

        let listing = marketplace.listings.remove<ID, Listing>(nft_id);
        assert!(listing.owner == sender, EInvalidOwner);

        let nft: N = dof::remove(&mut marketplace.id, nft_id);

        let Listing { id, owner, price, nft_id: _ } = listing;

        event::emit(ListingCancelled {
            object_id: id.uid_to_inner(),
            nft_id,
            creator: owner,
            price,
        });

        id.delete();

        nft
    }

    public fun buy<N: key + store>(
        marketplace: &mut Marketplace,
        nft_id: ID,
        coin: Coin<SUI>,
        ctx: &mut TxContext
    ): N {
        assert!(dof::exists_(&marketplace.id, nft_id), EInvalidNft);
        let nft: N = dof::remove(&mut marketplace.id, nft_id);

        let listing = marketplace.listings.remove<ID, Listing>(nft_id);
        let Listing { id, owner, price, nft_id: _ } = listing;

        assert!(coin.value() == price, EInvalidAmount);

        event::emit(Buy {
            object_id: id.uid_to_inner(),
            nft_id: object::id(&nft),
            creator: owner,
            buyer: ctx.sender(),
            price,
        });

        transfer::public_transfer(coin, owner);

        id.delete();

        nft
    }

    public fun place_bid(marketplace: &mut Marketplace, nft_id: ID, coin: Coin<SUI>, ctx: &mut TxContext): ID {
        assert!(dof::exists_(&marketplace.id, nft_id), EInvalidNft);

        let sender = ctx.sender();

        let bid = Bid {
            id: object::new(ctx),
            nft_id,
            balance: coin.into_balance(),
            owner: sender
        };

        let bid_id = object::id(&bid);

        event::emit(BidCreated {
            object_id: bid_id,
            nft_id,
            price: bid.balance.value(),
            creator: sender,
        });

        if (marketplace.bids.contains(nft_id)) {
            let elements = marketplace.bids.borrow_mut(nft_id);
            elements.push_back(bid);
        } else {
            marketplace.bids.add<ID, vector<Bid>>(nft_id, vector::singleton(bid));
        };

        bid_id
    }

    public fun cancel_bid(marketplace: &mut Marketplace, nft_id: ID, bid_id: ID, ctx: &mut TxContext): Coin<SUI> {
        let bid = get_and_remove_bid(marketplace, nft_id, bid_id);

        let sender = ctx.sender();
        assert!(bid.owner == sender, EInvalidOwner);

        let Bid { id, nft_id, balance, owner } = bid;

        event::emit(BidCancelled {
            object_id: id.uid_to_inner(),
            nft_id,
            creator: owner,
            price: balance.value(),
        });

        id.delete();

        coin::from_balance(balance, ctx)
    }

    public fun accept_bid<N: key + store>(
        marketplace: &mut Marketplace,
        nft_id: ID,
        bid_id: ID,
        ctx: &mut TxContext
    ): Coin<SUI> {
        let sender = ctx.sender();
        // if NFT exists then listing must exist for sure
        assert!(dof::exists_(&marketplace.id, nft_id), EInvalidNft);
        let listing = marketplace.listings.remove<ID, Listing>(nft_id);
        assert!(listing.owner == sender, EInvalidOwner);

        let nft: N = dof::remove(&mut marketplace.id, nft_id);

        let Listing { id: listing_id, owner: _, price: _, nft_id: _ } = listing;

        let bid = get_and_remove_bid(marketplace, nft_id, bid_id);

        let Bid { id, nft_id: _, balance, owner } = bid;

        event::emit(AcceptBid {
            object_id: id.uid_to_inner(),
            nft_id: object::id(&nft),
            creator: owner,
            seller: ctx.sender(),
            price: balance.value(),
        });

        transfer::public_transfer(nft, owner);

        id.delete();
        listing_id.delete();

        coin::from_balance(balance, ctx)
    }

    // === Private Functions ===

    fun get_and_remove_bid(marketplace: &mut Marketplace, nft_id: ID, bid_id: ID): Bid {
        assert!(marketplace.bids.contains<ID, vector<Bid>>(nft_id), EBidNotFoundForNFTId);
        let bids = marketplace.bids.borrow_mut<ID, vector<Bid>>(nft_id);

        let mut bid: Option<Bid> = option::none();
        let length = bids.length();
        let mut i = 0;
        while (i < length) {
            if (object::id(bids.borrow(i)) == bid_id) {
                bid.destroy_none();
                bid = option::some(bids.swap_remove(i));

                break
            };

            i = i + 1;
        };

        assert!(bid.is_some(), EBidNotFoundForNFTId);

        if (bids.is_empty()) {
            let v = marketplace.bids.remove<ID, vector<Bid>>(nft_id);
            v.destroy_empty();
        };

        bid.destroy_some()
    }
}
