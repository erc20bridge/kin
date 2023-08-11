use {
    anchor_lang::prelude::*,
    context::*,
    anchor_spl::token::{self, Transfer},
};

pub mod context;
pub mod state;
pub mod utils;

declare_id!("v32YSnVQDJfpVZm21APm5V7j1R3xCKU6VbsZRtAXb9A");

#[cfg(not(feature = "no-entrypoint"))]
use {solana_security_txt::security_txt};

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Swap And Burn",
    project_url: "https://github.com/erc20bridge/kin",
    contacts: "",
    policy: "https://github.com/erc20bridge/kin/blob/main/LICENSE.md",
    preferred_languages: "en",
    source_code: "https://github.com/erc20bridge/kin"
}

#[program]
pub mod swap_and_burn {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        ctx.accounts.pool.data_version = state::DataVersion::Version1;
        ctx.accounts.pool.nonce = ctx.accounts.nonce.key();
        ctx.accounts.pool.bump =  *ctx.bumps.get("pool").unwrap();
        ctx.accounts.pool.burn_from_mint = ctx.accounts.burn_from_mint.key();
        ctx.accounts.pool.swap_to_mint = ctx.accounts.swap_to_mint.key();
        ctx.accounts.pool.send_vault = ctx.accounts.send_vault.key();
        ctx.accounts.pool.send_vault_bump = *ctx.bumps.get("send_vault").unwrap();
        ctx.accounts.pool.receive_vault = ctx.accounts.receive_vault.key();
        ctx.accounts.pool.receive_vault_bump = *ctx.bumps.get("receive_vault").unwrap();

        Ok(())
    }
    pub fn swap_and_burn(ctx: Context<SwapAndBurn>) -> Result<()> {
        let mut burn_amount = ctx.accounts.source.amount;
        if burn_amount == 0 {
            // Nothing to swap and burn
            return Ok(());
        }

        // Initially, set swap amount equal to burn amount. Afterwards, normalize
        // based on decimal counts of both mints.
        let mut swap_amount = burn_amount;

        let mut source_decimals = ctx.accounts.burn_from_mint.decimals;
        let destination_decimals = ctx.accounts.swap_to_mint.decimals;

        let mut source_decimals_removed = 0;
        while source_decimals > destination_decimals {
            swap_amount = swap_amount / 10;
            source_decimals = source_decimals - 1;

            // Don't take dust when burn mint has more decimals
            source_decimals_removed = source_decimals_removed + 1;
            burn_amount = burn_amount - burn_amount % u64::pow(10, source_decimals_removed);
        }

        while source_decimals < destination_decimals {
            swap_amount = swap_amount * 10;
            source_decimals = source_decimals + 1;
        }

        if burn_amount == 0 || swap_amount == 0 {
            // Nothing to swap and burn
            return Ok(());
        }

        // Burn by sending to a vault that is owned by this program and has no
        // instruction for sending tokens. This locks tokens forever, which is
        // effectively a burn. In an abundance of caution, the burn instruction
        // is not used to consider wrapped tokens managed by bridges. Unlocking
        // tokens on the other chain typically involves an equivalent burn on the
        // SPL token mint, so any potential attack vectors referencing supply
        // mismatches due to executing the swap and burn instruction are eliminated.
        let burn_cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let burn_cpi_accounts = Transfer {
            from: ctx.accounts.source.to_account_info().clone(),
            to: ctx.accounts.receive_vault.to_account_info().clone(),
            authority: ctx.accounts.owner.to_account_info().clone(),
        };
        let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
        token::transfer(burn_cpi_ctx, burn_amount)?;

        let seeds = [
            utils::PREFIX_POOL_VAULT.as_bytes(),
            ctx.accounts.pool.to_account_info().key.as_ref(),
            ctx.accounts.swap_to_mint.to_account_info().key.as_ref(),
            &[ctx.accounts.pool.send_vault_bump]
        ];
        let signer = &[&seeds[..]];

        let transfer_cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let transfer_cpi_accounts = Transfer {
            from: ctx.accounts.send_vault.to_account_info().clone(),
            to: ctx.accounts.destination.to_account_info().clone(),
            authority: ctx.accounts.send_vault.to_account_info().clone(),
        };
        let transfer_cpi_ctx = CpiContext::new_with_signer(transfer_cpi_program, transfer_cpi_accounts, signer);
        token::transfer(transfer_cpi_ctx, swap_amount)?;

        Ok(())
    }
}