import { useState } from "react"
import acm from '../img/acm.png'

export function Main({stakingBalance, jamTokenBalance, stellartTokenBalance, stakeTokens, unstakeTokens}) {
    const [inputValue, setInputValue] = useState(0)
    const isWeb3Loaded = window.web3 && window.web3.utils;
    return (
        <div id="content" className="mt-3">
            <table className="table table-borderless text-muted text-center">
                <thead>
                    <tr>
                        <th scope="col">Balance de Staking</th>
                        <th scope="col">Balance de recompensas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {isWeb3Loaded ? (
                            <>
                                <td>{window.web3.utils.fromWei(stakingBalance, "Ether")} JAM</td>
                                <td>{window.web3.utils.fromWei(stellartTokenBalance, "Ether")} STE</td>
                            </>
                        ) : (
                            <td colSpan="2">Loading...</td>
                        )}
                    </tr>
                </tbody>
            </table>

            <div className="card mb-4">
                <div className="card-body">
                    <form className="mb-3" onSubmit={(event) =>{
                        event.preventDefault()
                        const amount = window.web3.utils.toWei(inputValue, "ether")
                        stakeTokens(amount)
                    }}> 
                        <div>
                            <label className="float-left">
                                <b>Stake Tokens</b>
                            </label>
                            {
                                isWeb3Loaded
                                && (
                                    <span className="float-right text-muted">
                                        Balance: {window.web3.utils.fromWei(jamTokenBalance, 'ether')}
                                    </span>
                                )
                            }
                        </div>

                        <div className="input-group mb-4">
                            <input 
                                type="text" 
                                onChange={(evt) => setInputValue(evt.target.value)}
                                className="from-control form-control-lg"
                                placeholder="0"
                                required
                            />

                            <div className="input-group-append">
                                <div className="input-group-text flex gap-10">
                                    <img src={acm} height={32} /> 
                                    <span>JAM</span>        
                                </div>
                            </div>
                        </div>
                        <button type="submit" onSubmit={stakeTokens} className="btn btn-primary btn-block">
                            STAKE!
                        </button>
                    </form>
                    <button 
                        type="button" 
                        className="btn btn-link btn-block btn-lg" 
                        onClick={unstakeTokens}
                    >
                            UNSTAKE
                    </button>
                </div>
            </div>
        </div>
    )

}