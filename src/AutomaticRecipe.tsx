import React from 'react'
import { Container } from 'reactstrap'
import { AllHtmlEntities } from 'html-entities'
import moment from 'moment'
import ManualRecipe from './ManualRecipe'


interface Props {
}

interface State {
    url: string,
    name: string,
    description: string,
    meal_type: string,
    ingredients: Array<string>,
    method: Array<string>,
    image: string,
    cooking_time: string,
    clicked: boolean,
    show_error: boolean,
    show_message: boolean,
    show_browse: boolean
}

class AutomaticRecipe extends React.Component<Props, State> {

    constructor(props:Props) {
        super(props)
        this.state = {
            url: '',
            name: '',
            description: '',
            meal_type: '',
            ingredients: [],
            method: [],
            image: '',
            cooking_time: '',
            clicked: false,
            show_error: false,
            show_message: false,
            show_browse: true
        }
    }

    
    cats = ['appetiser', 'main course', 'dessert']

    process = (data:string) => {
        const domParser = new DOMParser()
        const htmlDecoder = new AllHtmlEntities()
        const doc = domParser.parseFromString(data, 'text/html')
        const ldJSON = doc.querySelector('script[type="application/ld+json"]')
        if (ldJSON) {

            this.setState({show_error: false})
            let rawJSON;

            try {
                rawJSON = JSON.parse(ldJSON.innerHTML)
            } catch (error) {
                console.error(error)
                this.setState({show_error: true})
            }

            if (rawJSON) {
                let jsonData;

                if (Array.isArray(rawJSON)) {
                    for (let i=0;i<rawJSON.length;i++) {
                        let jsonObj = rawJSON[i]
                        if (jsonObj.name) {
                            jsonData = jsonObj
                        }
                    }
                } else {
                    jsonData = rawJSON
                    if (jsonData.hasOwnProperty('@graph')) {
                        let graph = jsonData['@graph']
                        for (let node of graph) {
                            if (node['@type'] === 'Recipe') {
                                jsonData = node
                            }
                        }
                    }
                }

                let rawMethod = jsonData.recipeInstructions
                let rawDescription = jsonData.description
                let rawImage = jsonData.image
                let rawCategory = jsonData.recipeCategory
                let rawTime = jsonData.totalTime

                if (typeof(rawMethod) === 'string') {
                    let methodAsArray = rawMethod.split('\n').filter(step => step.length > 1)
                    const finalMethod = methodAsArray.map(step => htmlDecoder.decode(step.replace(/<[^>]*>/g, '')))
                    this.setState({method: finalMethod})
                } else if (Array.isArray(rawMethod)) {
                    let finalMethod:Array<string> = []
                    for (let step of rawMethod) {
                        if (typeof(step) === 'string') {
                            finalMethod.push(htmlDecoder.decode(step.replace(/<[^>]*>/g, '')))
                        } else {
                            finalMethod.push(htmlDecoder.decode(step.text.replace(/<[^>]*>/g, '')))
                        }
                    }
                    this.setState({method: finalMethod})
                }

                if (rawImage) {
                    if (typeof(rawImage) === 'string') {
                        this.setState({image: rawImage})
                    } else if (Array.isArray(rawImage)) {
                        this.setState({image: rawImage[0]})
                    } else {
                        this.setState({image: rawImage.url})
                    }
                } else {

                }
                

                if (rawDescription) {
                    this.setState({description: htmlDecoder.decode(rawDescription.replace(/<[^>]*>/g, ''))})
                }

                if (rawCategory) {
                    let cleanRawCategory;
                    if (Array.isArray(rawCategory)) {
                        cleanRawCategory = rawCategory.join(' ')
                    } else {
                        cleanRawCategory = rawCategory
                    }
                    for (let cat of this.cats) {
                        if (cleanRawCategory.toLowerCase().includes(cat)) {
                            this.setState({meal_type: cat})
                        }
                    }
                }

                this.setState({
                    name: jsonData.name,
                    ingredients: jsonData.recipeIngredient.map((ing:string) => htmlDecoder.decode(ing)),
                    cooking_time: moment.duration(rawTime).asMinutes().toString(),
                })
            }
        } else {
            console.error('No reliable data found!')
            this.setState({show_error: true})
        }
    }

    scrape = async (url:string|undefined) => {
        if (url) {
            let res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            let jsonRes = await res.json()
            this.process(jsonRes.contents)
        }  
        this.setState({show_message: true, show_browse: false})
        this.setState({clicked: false})
        this.setState({clicked: true})
    }

    handleURLChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({url: e.currentTarget.value})
    }

    clearAutomatic = () => {
        this.setState({url: '', show_message: false})
    }

    render() {
        return (
            <Container>
                <div className='inputDiv'>
                    <label htmlFor='autoURL'>Recipe URL</label><br/>
                    <input className='formInput' required name='autoURL' type='text' onChange={this.handleURLChange} 
                    value={this.state.url}></input>
                </div>
                <button className='styledButton' onClick={() => {
                    this.scrape(this.state.url)
                }}>Submit URL</button>
                {this.state.show_browse ? <div><br/><button className='styledButton' onClick={() => {
                        window.location.reload()
                    }}>Back to browse</button></div> : null}
                {this.state.show_error ? <h2 style={{fontWeight: 200, paddingTop: '30px'}}>Oops! No reliable data found for this URL. Please add this recipe manually!</h2> : null}
                {this.state.clicked && !this.state.show_error ? <div>
                    {this.state.show_message ? <h2 style={{fontWeight: 200, paddingTop: '30px', paddingBottom: '30px'}}>
                        Recipe data extracted where possible. Make sure to double-check the information before adding the recipe!</h2> : null}
                    <ManualRecipe name={this.state.name} description={this.state.description} 
                meal_type={this.state.meal_type} ingredients={this.state.ingredients} method={this.state.method} image={this.state.image} 
                cooking_time={this.state.cooking_time} clearAutomatic={this.clearAutomatic}/> 
                </div>: null}
            </Container>    
        )
    }
}

export default AutomaticRecipe;