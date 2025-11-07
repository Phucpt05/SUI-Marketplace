/// Module: awesome_nft
module awesome_nft::awesome_nft {
    use std::string::String;

    use sui::kiosk::Kiosk;
    use sui::package;
    use sui::transfer_policy::TransferPolicy;

    use awesome_nft::awesome_extension;

    public struct MintCap has key, store {
        id: UID,
    }

    public struct AwesomeNFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        creator: Address
    }

    public struct AWESOME_NFT has drop {}

    fun init(otw: AWESOME_NFT, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        transfer::public_transfer(MintCap { id: object::new(ctx) }, ctx.sender());
    }

    /// Creates a new AwesomeNFT and locks it in the Kiosk `kiosk`.
    /// Note that `kiosk` should have the extension `awesome_nft::awesome_extension::Ext` installed.
    public fun mint_to_kiosk(
        _: &MintCap,
        name: String,
        description: String,
        url: Url,
        kiosk: &mut Kiosk,
        policy: &TransferPolicy<AwesomeNFT>,
        ctx: &mut TxContext
    ) {
        awesome_extension::lock(
            kiosk, 
            AwesomeNFT {
                id: object::new(ctx),
                name,
                description,
                url,
                creator: ctx.sender(),
            },
            policy
        );
    }

    public fun drop(nft: AwesomeNFT) {
        let AwesomeNFT {
            id,
            name: _,
            description: _,
            url: _,
            creator: _
        } = nft;
        id.delete();
    }
}