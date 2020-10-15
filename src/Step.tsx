import React from 'react'

interface Props {
    stepNumber: number,
    step: string
}

const Step: React.FC<Props> = ({stepNumber, step}) => {
    return (
        <div>
            <h4 style={{paddingBottom: 10, textAlign: 'left'}}>Step {stepNumber}</h4>
            <p style={{padding: 10, paddingLeft: 0, fontSize: '22px', textAlign: 'left'}}>{step}</p>
        </div>
    )
}

export default Step;
