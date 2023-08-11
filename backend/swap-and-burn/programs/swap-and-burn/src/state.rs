use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum DataVersion {
    Unknown = 0,
    Version1,
}

impl Default for DataVersion {
    fn default() -> Self {
        DataVersion::Unknown
    }
}

#[account]
pub struct Pool {
    // https://solanacookbook.com/guides/data-migration.html#how-can-you-migrate-a-program-s-data-accounts
    pub data_version: DataVersion, 

    pub bump: u8,

    pub nonce: Pubkey,
    
    pub burn_from_mint: Pubkey,
    pub swap_to_mint: Pubkey,

    pub send_vault: Pubkey,
    pub send_vault_bump: u8,

    pub receive_vault: Pubkey,
    pub receive_vault_bump: u8,
}

impl Pool {
    pub const LEN: usize = 
        8  +  // discriminator
        1  +  // data_version

        1 + // bump

        32 +  // nonce

        32 +  // burn_from_mint
        32 +  // swap_to_mint

        32 +  // send_vault
        1  +  // send_vault_bump

        32 +  // receive_vault
        1  ;  // receive_vault_bump
}
