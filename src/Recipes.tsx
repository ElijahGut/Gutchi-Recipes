import React from 'react'
import { useState, useEffect } from 'react' 
import { IRecipe } from './App'
import Recipe from './Recipe'
import { Row, Container } from 'reactstrap'
import FadeIn from 'react-fade-in'

interface Props {
    recipes: Array<IRecipe>,
    headerString: string,
    searchVal?: string,
    handleSetRecipeToShow: any,
    handleSetShowRecipePage: any
}

const Recipes: React.FC<Props> = ({recipes, headerString, searchVal, handleSetRecipeToShow, handleSetShowRecipePage}) => {

    const [showMore, setShowMore] = useState(true)
    const [topIndex, setTopIndex] = useState(8)

    const minLength = 8;

    useEffect(() => {
        setTopIndex(8)
        if (recipes.length <= minLength) {
            setShowMore(false)
        } else {
            setShowMore(true)
        }
    }, [recipes])

    if (headerString === 'Search Results' && recipes.length === 0) {
        return (
            <Container>
                <FadeIn><h1 style={{fontWeight: 200, paddingBottom: 30, textAlign: 'left'}}>{headerString}</h1></FadeIn>
                <FadeIn><h2 style={{fontWeight: 200, textAlign: 'left'}}>Sorry, no results for <span style={{fontWeight: 500}}>{searchVal}</span></h2></FadeIn>
            </Container>
        )
    } else {
        return (
            <Container>
                <FadeIn><h1 style={{fontWeight: 200, paddingBottom: 30, textAlign: 'left'}}>{headerString}</h1></FadeIn>
                <Row>{recipes.slice(0,topIndex).map((recipe, i) => <Recipe key={i} recipe={recipe} handleSetRecipeToShow={handleSetRecipeToShow} 
                handleSetShowRecipePage={handleSetShowRecipePage}/>)}</Row>
                {showMore ? <FadeIn delay={600}><button className='styledButton' onClick={() => {
                    if (topIndex+minLength < recipes.length) {
                        setShowMore(true)
                        setTopIndex(prevTopIndex => {return prevTopIndex+8});
                    } else {
                        setTopIndex(recipes.length)
                        setShowMore(false)
                    }
                }}>See more</button></FadeIn> 
                : null}
            </Container>   
        )
    }
} 

export default Recipes;
