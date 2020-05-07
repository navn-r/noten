import React from 'react';
import Button from './Button';
import Colors from '../constants/Colors';

const ToggleButton = (props) => {
    return(
        <>
        {props.bool ? <Button style={{...props.style}} color={Colors.green} size={props.size} title={props.TrueTitle} onPress={props.onPress}/> : <Button style={{...props.style}} color={Colors.red} size={props.size} title={props.FalseTitle} onPress={props.onPress}/>}
        </>
    );
};

export default ToggleButton;