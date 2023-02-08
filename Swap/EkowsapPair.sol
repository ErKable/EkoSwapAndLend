//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import"./ICallee.sol";
import"./IMaths.sol";
import"./IEkoswapERC20.sol";


contract EkoswapPair is IEkoswapERC20, Math {
    uint256 constant MinLiquidity = 10**3;


    address public factory;
    address public tokenA;
    address public tokenB;

    uint112 private reserveA;
    uint112 private reserveB;
    uint32 private blockTimestampLast;

    uint256 public priceACummulativesLast;
    uint256 public priceBCummulativesLast;
    uint ConstProd;

    bool private Reentrancy;
    modifier nonReentrant() {
        require(!Reentrancy);
        Reentrancy = true;
    
        _;

        Reentrancy = false;

    }

    error InsufficientLiquidityProvided();
    error InsufficientLiquidityWithdraw();
    error TransferFailed();

    event liquidityWithdrawn(address indexed sender, uint256 amountA, uint256 amountB);
    event liquidityProvided(address indexed sender, uint256 amountA, uint256 amountB);
    event Sync(uint256 reserveA, uint256 reserveB);

     constructor() public {
        factory = msg.sender;
    }

    function initialize(address _tokenA, address _tokenB) public {
        if(msg.sender != factory && tokenA != address(0) || tokenB != adress(0)) 
            revert AlreadyInitialized();
        tokenA = _tokenA;
        tokenB = _tokenB;
    }


    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, value));
        if (!success || (data.length != 0 && !abi.decode(data, (bool))))
            revert TransferFailed();
    }


    function _update( uint256 balanceA, uint256 balanceB, uint112 _reserveA, uint112 _reserveB) private{
    unchecked {uint32 timeElapsed = uint32(block.timestamp) - blockTimestampLast;

    if (timeElapsed > 0 && _reserveA > 0 && _reserveB > 0) {
        priceACumulativeLast += uint256(UQ112x112.encode(_reserveA).uqdiv(_reserveA)) * timeElapsed;
        priceBCumulativeLast += uint256(UQ112x112.encode(_reserveB).uqdiv(_reserveB)) * timeElapsed;
        }
    }
    reserveA = uint112(balanceA);
    reserveB = uint112(balanceB);
    blockTimestampLast = uint32(block.timestamp);
    }


    function LiquidityFee(uint112 _reserveA, uint112 _reserveB) private returns (bool feeOn) {
        address feeTo = EkoswapFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _ConstProd = ConstProd;
        if (feeOn) {
            if (_ConstProd != 0) {
                uint rootK = Math.sqrt(uint( _reserveA * _reserveB));
                uint rootConstProd = Math.sqrt(_ConstProd);
                if (rootK > rootConstProd) {
                    uint numerator = totalSupply * (rootK - rootConstProd);
                    uint denominator = (rootK * 5) + (rootConstProd);
                    uint liquidity = numerator / denominator;
                    if (liquidity > 0) _provideLiquidity(feeTo, liquidity);
                }
            }
        } else if (_ConstProd != 0) {
            ConstProd = 0;
        }
    }


    function provideLiquidity() private nonReentrant returns (uint Liquidity) {
        (uint112 _reserveA, uint112 _reserveB) = getReserves();
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        uint256 amountA = balanceA - _reserveA;
        uint256 amountB = balanceA - _reserveB;

        bool feeOn = _mintFee(_reserveA, _reserveB);
        uint _totalSupply = totalSupply;

        uint256 liquidity;
        if (totalSupply == 0) {
            liquidity = Math.sqrt(amountA * amountB) - MinLiquidity; _mint(address(0), MinLiquidity);
        } else {
            liquidity = Math.min((amount0 * totalSupply) / _reserveA, (amount1 * totalSupply) / _reserveB);
        }

        if (liquidity <= 0) revert InsufficientLiquidityProvided();
            _mint(msg.sender, liquidity); _update(balanceA, balanceB);
        emit Mint(msg.sender, amountA, amountB);


        _update(balanceA, balanceB, _reserveA, _reserveB);
        if (feeOn) ConstProd = uint(reserveA * reserveB); // reserve0 and reserve1 are up-to-date
    }

    function WithdrawLiquidity(address to) external nonReentrant returns (uint AmountA, uint AmountB){
        (uint112 _reserveA, uint112 _reserveB,) = getReserves(); 
        address _tokenA = tokenA;
        address _tokenB = tokenB;
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        uint256 liquidity = balanceOf[msg.sender];

         bool feeOn = _mintFee(_reserveA, _reserveB);
        uint _totalSupply = totalSupply;
        _burn(address(this), liquidity);
        uint256 amountA = (liquidity * balanceA) / totalSupply;
        uint256 amountB = (liquidity * balanceB) / totalSupply;

        if (amountA <= 0 || amountB <= 0) revert InsufficientLiquidityBurned();
            _burn(msg.sender, liquidity);

        _safeTransfer(tokenA, msg.sender, amountA);
        _safeTransfer(tokenB, msg.sender, amountB);

        balanceA = IERC20(tokenA).balanceOf(address(this));
        balanceB = IERC20(tokenB).balanceOf(address(this));
        _update(balanceA, balanceB);

       update(balanceA, balanceB, _reserveA, _reserveB);
        if (feeOn) ConstProd = uint(reserveA * reserveB); 
        emit liquidityprovided(msg.sender, amount0, amount1, to);
    }

    function swap(uint256 amountAOut, uint256 amountBOut, address to, byets calldata data) public nonReentrant {
            (uint112 _reserveA, uint112 _reserveB, ) = getReserves();
        if (amountAOut > reserveA_ || amountBOut > reserveB_) revert InsufficientLiquidity();

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;

        if (to == _tokenA && to == _tokenB) revert InvalidAddress();
        if (amountAOut > 0) _safeTransfer(_tokenA, to, amountAOut); 
        if (amountBOut > 0) _safeTransfer(_tokenB, to, amountBOut); // optimistically transfer tokens
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amountAOut, amountBOut, data);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amountAIn = balanceA > _reserveA - amountAOut ? balanceA - (_reserveA - amountAOut) : 0;
        uint256 amountBIn = balanceB > _reserveB - amountBOut ? balanceB - (_reserveB - amountBOut) : 0;
        if (amountAIn == 0 && amount1In == 0) revert InsufficientInputAmount();

        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint256 balanceAAdjusted = (balanceA * 1000) - (amountAIn * 3);
        uint256 balanceBAdjusted = (balanceB * 1000) - (amountBIn * 3);
        if ((balanceAAdjusted * balanceBAdjusted) < uint(_reserveA) * (_reserveB) * (1000**2))
            revert InvalidConstantProduct();
        }
            uint256 balanceA = IERC20(tokenA).balanceOf(address(this)) - amountAOut;
            uint256 balanceB = IERC20(tokenB).balanceOf(address(this)) - amountBOut;
        if (balanceA * balanceB < uint256(_reserveA) * uint256(_reserveB))
            revert InvalidK();

            _update(balanceA, balanceB, _reserveA, _reserveB);

        if (amountAOut > 0) _safeTransfer(tokenA, to, amountAOut);
        if (amountBOut > 0) _safeTransfer(tokenB, to, amountBOut);

    emit Swap(msg.sender, amount0Out, amount1Out, to);
    }

    function sync() public { _update(
            IERC20(tokenA).balanceOf(address(this)),
            IERC20(tokenB).balanceOf(address(this)));
    }
    function getReserves() public view returns (uint112,uint112,uint32) {
        return (reserveA, reserveB, 0);
    }

    function _update(uint256 balanceA, uint256 balanceB) private {
        reserveA = uint112(balanceA);
        reserveB = uint112(balanceB);

        emit Sync(reserveA, reserveB);
    }
}
