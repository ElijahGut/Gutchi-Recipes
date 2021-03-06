import React from 'react'
import { useState } from 'react'
import { IRecipe } from './App'
import './App.css'
import {
    Card, CardText, CardImg, CardBody,
    CardTitle, Col
  } from 'reactstrap';
import FadeIn from 'react-fade-in'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

interface Props {
    recipe: IRecipe,
    handleSetRecipeToShow: any,
    handleSetShowRecipePage: any
}

const Recipe: React.FC<Props> = ({recipe, handleSetRecipeToShow, handleSetShowRecipePage}) => {

    const [isHovered, setHover] = useState(false)
    const [seeDesc, setSeeDesc] = useState(false)

    const cardImgHeight = '200px';
    const maxNameLength = 15;

    const forbidden = ['&amp;', 'recipe']
    const articleWords = ['the', 'of', 'and', 'a', 'with', 'on', '&', 'by']

    const capitaliseName = (recipeName: (string|undefined)) => {
        let result = ''
        if (recipeName) {
            const recipeNameSplit = recipeName.split(' ')
            for (let i=0;i<recipeNameSplit.length;i++) {
                let word = recipeNameSplit[i];
                if (!forbidden.includes(word)) {
                    if (!articleWords.includes(word) || (i === 0 && (word === 'the' || word === 'a'))) {
                        
                        let capitalisedWord = word.charAt(0).toUpperCase()+word.slice(1)
                        result += capitalisedWord += ' ' 
                        
                    } else {
                        result += word += ' '
                    }
                }
            }
            return result.trim();
        } 
    }

    const capitaliseDesc = (desc: string) => {
        return desc.charAt(0).toUpperCase()+desc.slice(1)
    }

    const renderRecipePage = () => {
        handleSetRecipeToShow(recipe)
        handleSetShowRecipePage(true)
        window.scrollTo(0,0)
    }

    return (
        <Col className='recipeCard' sm={{size: 3}} style={{marginBottom: 30}}>
            <FadeIn>
            <Card>
            <CardImg style={{objectFit: 'cover'}} top width='100%' height={cardImgHeight} src={recipe.image} alt="Card image cap" />
            <CardBody>
                <CardTitle className='cardTitle' onClick={renderRecipePage} style={{fontSize: 'larger', fontWeight: 'bold'}}>
                    {(recipe.name.length <= maxNameLength) ? capitaliseName(recipe.name) 
                    : capitaliseName(recipe.short_name)}</CardTitle>
                {seeDesc ? <CardText>{capitaliseDesc(recipe.description)}</CardText> : null}
                <CardText className='text-muted'><FontAwesomeIcon style={{marginRight: 15}} 
                icon={faClock}/><small>{recipe.cooking_time+'min'}</small></CardText>
                <div>
                    <small onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
                    onClick={() => {
                        setHover(false);
                        setSeeDesc(prevState => !prevState)
                    }}
                    style={isHovered ? 
                    {paddingTop: '30px', paddingRight: '10px', float: 'left', color: 'black', marginTop: '-25px', cursor: 'pointer'} 
                    : {paddingTop: '30px', paddingRight: '10px', float: 'left', color: 'grey', marginTop: '-25px', cursor: 'pointer'}}>{seeDesc ? 
                    'Hide description' : 'Read description'}</small>
                </div> 
            </CardBody>
            </Card>
            </FadeIn> 
        </Col>
    ) 
}

export default Recipe;