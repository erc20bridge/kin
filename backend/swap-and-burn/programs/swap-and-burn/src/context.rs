use crate::state::*;
use crate::utils::*;

use {
    anchor_lang::prelude::*,
    anchor_spl::{
        token::{TokenAccount, Mint, Token},
    },
};

#[derive(Accounts)]
#[instruction()]
pub struct InitializePool<'info> {
    #[account(
        init,
        seeds=[
            PREFIX_POOL_STATE.as_bytes(),
            nonce.to_account_info().key.as_ref(),
            burn_from_mint.to_account_info().key.as_ref(),
            swap_to_mint.to_account_info().key.as_ref(),
        ],

        payer = payer,
        space = Pool::LEN,
        bump
    )]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        init,
        payer = payer,

        token::mint = swap_to_mint,
        token::authority = send_vault,

        seeds=[
            PREFIX_POOL_VAULT.as_bytes(),
            pool.to_account_info().key.as_ref(),
            swap_to_mint.to_account_info().key.as_ref(),
        ],
        bump,
    )]
    pub send_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = payer,

        token::mint = burn_from_mint,
        token::authority = receive_vault,

        seeds=[
            PREFIX_POOL_VAULT.as_bytes(),
            pool.to_account_info().key.as_ref(),
            burn_from_mint.to_account_info().key.as_ref(),
        ],
        bump,
    )]
    pub receive_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK: address is used as nonce, no data is accessed
    pub nonce: UncheckedAccount<'info>, 

    pub burn_from_mint: Box<Account<'info, Mint>>,
    pub swap_to_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction()]
pub struct SwapAndBurn<'info> {
    #[account(
        has_one = burn_from_mint,
        has_one = swap_to_mint,

        seeds=[
            PREFIX_POOL_STATE.as_bytes(),
            pool.nonce.as_ref(),
            pool.burn_from_mint.as_ref(),
            pool.swap_to_mint.as_ref(),
        ],
        bump = pool.bump,
    )]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        mut,
        constraint = send_vault.key() == pool.send_vault,

        token::mint = pool.swap_to_mint,

        seeds=[
            PREFIX_POOL_VAULT.as_bytes(),
            pool.to_account_info().key.as_ref(),
            pool.swap_to_mint.as_ref(),
        ],
        bump = pool.send_vault_bump,
    )]
    pub send_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = receive_vault.key() == pool.receive_vault,

        token::mint = pool.burn_from_mint,

        seeds=[
            PREFIX_POOL_VAULT.as_bytes(),
            pool.to_account_info().key.as_ref(),
            pool.burn_from_mint.as_ref(),
        ],
        bump = pool.receive_vault_bump,
    )]
    pub receive_vault: Box<Account<'info, TokenAccount>>,

    pub burn_from_mint: Box<Account<'info, Mint>>,
    pub swap_to_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = source.amount > 0,

        token::mint = pool.burn_from_mint,
    )]
    pub source: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,

        token::mint = pool.swap_to_mint,
    )]
    pub destination: Box<Account<'info, TokenAccount>>,

    pub owner: Signer<'info>,

    pub token_program: Program<'info, Token>,
}
