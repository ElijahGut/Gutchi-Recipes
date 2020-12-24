import React from 'react'
import { useState } from 'react'
import { IRecipe } from './App'
import { Container } from 'reactstrap'
import FadeIn from 'react-fade-in';
import Step from './Step'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { AllHtmlEntities } from 'html-entities'

interface Props {
    recipe: IRecipe,
    handleSetRecipeToShow: any,
    handleSetShowRecipePage: any
}

const RecipePage: React.FC<Props> = ({recipe, handleSetRecipeToShow, handleSetShowRecipePage}) => {

    const fracs = [0, 0.5, 0.33, 0.25, 0.2, 0.13, 0.66, 0.75, 0.4, 0.6, 0.8, 0.83, 0.38, 0.63, 0.88]
    const [ingredientCardHeight, setIngCardHeight] = useState<number>(0)
    const [scrollOverFlow, setScrollOverflow] = useState<boolean>(false)
    const [customYield, setCustomYield] = useState<number>(recipe.yield)

    const htmlDecoder = new AllHtmlEntities()

    const backToBrowse = () => {
        handleSetRecipeToShow(false)
        handleSetShowRecipePage(false)
        window.scrollTo(0,0)
    }

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

    const plainFracToDec = (frac: string) => {
        const fracSplit = frac.split('/')
        const result = parseInt(fracSplit[0], 10) / parseInt(fracSplit[1], 10)
        return result
    }

    const getClosestFrac = (dec: number) => {
        const diffs = fracs.map(f => Math.abs(f-dec))
        const closestFrac = fracs[diffs.indexOf(Math.min(...diffs))]
        return closestFrac
    }

    const getFracString = (dec: number, isMixed: boolean) => {
        let closestFrac = getClosestFrac(dec)
        let closestFracString = closestFrac.toFixed(2).toString()
        switch (closestFracString) {
            case '0.50':
                return '&frac12;'
            case '0.33':
                return '&frac13;'
            case '0.25':
                return '&frac14;'
            case '0.20':
                return '&frac15;'
            case '0.13':
                return '&frac18;'
            case '0.66':
                return '&frac23;'
            case '0.75':
                return '&frac34;'
            case '0.40':
                return '&frac25;'
            case '0.60':
                return '&frac35;'
            case '0.80':
                return '&frac45;'
            case '0.83':
                return '&frac56;'
            case '0.38':
                return '&frac38;'
            case '0.63':
                return '&frac58;'
            case '0.88':
                return '&frac78;'
            case '0.00':
                if (isMixed) {
                    return ''
                } 
                return '0'
            default:
                return 'NONE'
        }
    }

    const entityToPlainFrac = (entity: string) => {
        let result = ''
        let re = /\d\d/g
        let digitsMatch = entity.match(re)
        if (digitsMatch) {
            let fracDigits = digitsMatch[0]
            let n = fracDigits.charAt(0)
            let d = fracDigits.charAt(1)
            result += n + '/'
            result += d
        }
        return result
    }

    const decToEntity = (totalDec: number) => {
        let converted = ''
        let frac = totalDec % 1
        let whole = totalDec - frac
        if (whole > 0) {
            converted += whole.toString() + ' '
            converted += getFracString(frac, true)
            return htmlDecoder.decode(converted)
        } else {
            converted += getFracString(frac, false)
            return htmlDecoder.decode(converted)
        }   
    }

    const convertMixed = (ing: string, regObj: Array<string>, isEntity: boolean) => {
        let splitFrac = regObj[0].split(' ')
        let n = splitFrac[0], f = isEntity ? entityToPlainFrac(splitFrac[1]) : splitFrac[1]
        let whole = parseInt(n)
        let dec = plainFracToDec(f)
        let totalDec = whole + dec
        let result = (totalDec/recipe.yield) * customYield
        let converted = decToEntity(result)
        return htmlDecoder.decode(ing.replace(regObj[0], converted))
    }

    const convertFrac = (ing: string, regObj: Array<string>, isEntity: boolean) => {
        let f = isEntity ? entityToPlainFrac(regObj[0]) : regObj[0]
        let dec = plainFracToDec(f)
        let result = (dec/recipe.yield) * customYield
        let converted = decToEntity(result)
        return htmlDecoder.decode(ing.replace(regObj[0], converted))
    }

    const calculateQuantity = (ing: string) => {

        let dashRe = /(&ndash;|&mdash;|-)\d/        
        ing = ing.replace(dashRe, '')

        let firstQ = ing.split(' ')[0] + ' ' + ing.split(' ')[1]

        let plainFracRe = /\d\/\d/g
        let entityFracRe = /&frac\d\d;/g
        let mixedPlainFracRe = /\d\s\d\/\d/g
        let mixedEntityFracRe = /\d\s&frac\d\d;/g
        let re = /\d+/g
        
        let qMixedPlain = firstQ.match(mixedPlainFracRe)
        let qMixedEntity = firstQ.match(mixedEntityFracRe)
        let qPlain = firstQ.match(plainFracRe)
        let qEntity = firstQ.match(entityFracRe)
        let q = firstQ.match(re)

        if (qMixedPlain) {
            return convertMixed(ing, qMixedPlain, false)
        } else if (qMixedEntity) {
            return convertMixed(ing, qMixedEntity, true)
        } else if (qPlain) {
            return convertFrac(ing, qPlain, false)
        } else if (qEntity) {
            return convertFrac(ing, qEntity, true)
        } else if (q) {
            let globalQPlain = ing.match(plainFracRe)
            if (globalQPlain) {
                let d = plainFracToDec(globalQPlain[0])
                let converted = getFracString(d, false)
                ing = ing.replace(globalQPlain[0], converted)
            }
            let currentQ = parseInt(q[0])
            let newQ = (currentQ/recipe.yield) * customYield
            if (!Number.isInteger(newQ)) {
                return htmlDecoder.decode(ing.replace(currentQ.toString(), newQ.toFixed(1).toString()))
            }
            return htmlDecoder.decode(ing.replace(currentQ.toString(), newQ.toString()))
        }  
        return htmlDecoder.decode(ing)
    }

    const renderIngredients = () => {
        return recipe.ingredients.map((ing, i) => <li key={i} style={{textAlign: 'left'}}>{calculateQuantity(htmlDecoder.encode(ing))}</li>)
    }

    const renderMethod = () => {
        return recipe.method.map((step, i) => <Step step={step} stepNumber={i+1} key={i}/>)
    }

    return (
        <FadeIn>
            <div style={{paddingTop:'10px'}}>
                <Container>
                    <img alt='recipeImage' src={recipe.image} style={{objectFit: 'cover', borderRadius: '50%', 
                    border: '1px solid white', marginBottom: '10px', marginRight: '2%'}} width={'225px'} height={'225px'}/>
                    <div style={{marginRight: '1.5%'}}>
                        <h1 style={{textAlign: 'center', paddingTop: 10}}>{capitaliseName(recipe.name)}</h1>
                        <hr style={{borderTop: '0.5px solid white', width: '25%'}}/>
                        <div>
                            <FontAwesomeIcon style={{marginRight: 10}} 
                            icon={faClock}/>{recipe.cooking_time+'min'}
                            <FontAwesomeIcon style={{marginLeft: 15, marginRight: 10}} icon={faUtensils}/>{recipe.meal_type.charAt(0).toUpperCase()+recipe.meal_type.slice(1)}
                        </div>
                        <div style={{paddingTop: 40}}>
                            <p><button style={{marginRight: 20}} className='yieldButton' type='button' onClick={() => {
                                if (customYield-1 >= 1) {
                                    setCustomYield(prev => prev-1)
                                }
                            }}>-</button>Servings: <span style={{fontWeight: 'bold'}}>{customYield}</span>
                            <button style={{marginLeft: 20}} className='yieldButton' type='button' onClick={() => {
                                setCustomYield(prev => prev+1)
                            }}>+</button>
                            <button style={{marginLeft: 20}} className='yieldButton' type='button' onClick={() => {
                                if (customYield * 2 <= 100) {
                                    setCustomYield(prev => prev * 2)
                                }
                            }}>Double</button>
                            <button style={{marginLeft: 10}} className='yieldButton' type='button' onClick={() => {
                                if (customYield * 0.5 >= 1) {
                                    setCustomYield(prev => Math.round(prev * 0.5))
                                } 
                            }}>Halve</button>
                            </p>  
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{position: 'sticky', top: 20, float: 'left', height: ingredientCardHeight, width: '100%', border: '1px solid white', 
                        borderRadius: '0.6em', padding: 15, paddingLeft: 20, paddingRight: 20, marginTop: 70, marginRight: 60, overflow: scrollOverFlow 
                        ? 'scroll' : 'visible'}}>
                            <h2 style={{textAlign: 'left'}}>Ingredients</h2>
                            <ul ref={el=> {
                                if (!el) return;
                                let candidateHeight = el.getBoundingClientRect().height+80
                                if (candidateHeight > 0.8*window.innerHeight) {
                                    setIngCardHeight(candidateHeight/2) 
                                    setScrollOverflow(true) 
                                } else {
                                    setIngCardHeight(candidateHeight)
                                    setScrollOverflow(false)
                                }
                            }}>
                                {renderIngredients()}
                            </ul>
                        </div>
                        <div style={{marginTop: 60}}>
                            <h2 style={{textAlign: 'left', paddingBottom: 30}}>Method</h2>
                            {renderMethod()}
                        </div>
                    </div>
                </Container>
                <button className='styledButton' style={{marginTop: 10}} type='button' onClick={backToBrowse}>Back to browse</button>
            </div>
        </FadeIn>
    )
}

export default RecipePage
