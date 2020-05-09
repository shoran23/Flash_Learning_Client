import React from 'react'

class Header extends React.Component {
    render () {
        return (
            <div className='header'>
                <div className='header-container'>
                    <h1>Flash Learning</h1>
                    <button className='back' onClick={() => this.props.clearCurrentTopic()}>Home</button>
                </div>
            </div>
        )
    }
}
export default Header