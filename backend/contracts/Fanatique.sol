// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
 █  ███████╗ █████╗ ███╗   ██╗ █████╗ ████████╗██╗ ██████╗ ██╗   ██╗███████╗ █
 █  ██╔════╝██╔══██╗████╗  ██║██╔══██╗╚══██╔══╝██║██╔═══██╗██║   ██║██╔════╝ █
 █  █████╗  ███████║██╔██╗ ██║███████║   ██║   ██║██║   ██║██║   ██║█████╗   █
 █  ██╔══╝  ██╔══██║██║╚██╗██║██╔══██║   ██║   ██║██║▄▄ ██║██║   ██║██╔══╝   █
 █  ██║     ██║  ██║██║ ╚████║██║  ██║   ██║   ██║╚██████╔╝╚██████╔╝███████╗ █
 █  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝ █
 █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
*/

import "./FanatiqueCards.sol";

/**
 * @title Fanatique
 * @dev Main contract for the Fanatique betting platform with integrated card system
 */
contract Fanatique is FanatiqueCards {
    /**
     * @dev Constructor
     * @param _cardSigner Address authorized to sign card mint transactions
     */
    constructor(address _cardSigner) FanatiqueCards(_cardSigner, address(this)) {
        // Contract initialization complete
    }
}
