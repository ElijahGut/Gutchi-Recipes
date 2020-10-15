import React from 'react'

interface Props {
    ingredient: string
}

const Ingredient: React.FC<Props> = ({ingredient}) => {
    return (
        <div>
            <p style={{fontSize: '18px', textAlign: 'left'}}>{ingredient}</p>
        </div>
    )
}

export default Ingredient;

