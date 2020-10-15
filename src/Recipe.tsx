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
    const [showLongTitle, setShowLongTitle] = useState(false)
    const [seeDesc, setSeeDesc] = useState(false)

    const cardImgHeight = '200px';
    const maxNameLength = 20;

    const articleWords = ['the', 'of', 'and', 'a', 'with', 'on']

    const capitaliseName = (recipeName: string) => {
        let result = ''
        const recipeNameSplit = recipeName.split(' ')

        for (let i=0;i<recipeNameSplit.length;i++) {
            let word = recipeNameSplit[i];
            if (!articleWords.includes(word.toLowerCase())) {
                let capitalisedWord = word.charAt(0).toUpperCase()+word.slice(1)
                result += capitalisedWord += ' '  
            } else {
                result += word += ' '
            }
        }
        return result.trim();
    }

    const capitaliseDesc = (desc: string) => {
        return desc.charAt(0).toUpperCase()+desc.slice(1)
    }

    const generateShortTitle = (title: string) => {
        let shortTitle = ''
        const titleSplit = title.split(' ')


        for (let i=0;i<titleSplit.length;i++) {
            let word = titleSplit[i]
            if (shortTitle.length+(word.length+1) < maxNameLength && !articleWords.includes(word)) {
                shortTitle += word += ' '
            }
        }
        return shortTitle.trim()
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
                <CardTitle className='cardTitle' onClick={renderRecipePage} onMouseEnter={() => setShowLongTitle(true)} 
                    onMouseLeave={() => setShowLongTitle(false)} style={{fontSize: 'larger', fontWeight: 'bold'}}>
                    {(recipe.name.length < maxNameLength || showLongTitle === true) ? capitaliseName(recipe.name) 
                    : generateShortTitle(capitaliseName(recipe.name.slice(0,maxNameLength)))}</CardTitle>
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