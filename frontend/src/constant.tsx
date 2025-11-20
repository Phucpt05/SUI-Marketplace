// Smart Contract Package IDs
export const KIOSK_PACKAGE_ID = '0xe24a73b3d335bf1a1ecdbaedf19724db947e10a5e8f9ed4852523e174387d17d';
export const AWESOME_PACKAGE_ID = '0x0ced4080b7fec948261fea4c0fb5680d397621d94cc0e326cc3905d08ca35582';

// Important Object IDs
export const MINT_CAP_ID = '0x3d83f3b3d84384d952b002d89b7df4cc9a98a6ae2f360152d448f9f71e310414';
export const PUBLISHER_ID = '0xb6871a0fc8706f4d7198d93e3d9aaa4c950ccbf339e9b5261e96a9e25ad7c56c';

// Kiosk Rules Package IDs (all pointing to the same kiosk_nft package)
export const KIOSK_RULES_PACKAGE_IDS = {
  kioskLockRulePackageId: KIOSK_PACKAGE_ID,
  royaltyRulePackageId: KIOSK_PACKAGE_ID,
  personalKioskRulePackageId: KIOSK_PACKAGE_ID,
  floorPriceRulePackageId: KIOSK_PACKAGE_ID,
};

// Type definitions for the smart contract
export const AWESOME_NFT_TYPE = `${AWESOME_PACKAGE_ID}::awesome_nft::AwesomeNFT`;
export const PERSONAL_KIOSK_CAP_TYPE = `${KIOSK_PACKAGE_ID}::personal_kiosk::PersonalKioskCap`;
export const MINT_CAP_TYPE = `${AWESOME_PACKAGE_ID}::awesome_nft::MintCap`;