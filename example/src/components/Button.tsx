import React, { memo, useCallback } from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet,
  Text as RNText,
} from 'react-native'

// @ts-ignore
function Button(props)  {
    const { intercom_title, intercom_disabled, intercom_onPress, intercom_accesibilityLabel } = props;
    const onPress = useCallback(() => {
        intercom_onPress();
    }, [intercom_onPress]);

    return (
      <RNTouchableOpacity
        style={buttonStyles(props).touchableOpacity}
        onPress={onPress}
        disabled={intercom_disabled}
        accessibilityLabel={intercom_accesibilityLabel}
      >
        <RNText
          style={buttonStyles(props).text}
          allowFontScaling={false}>
          {intercom_title}
        </RNText>
      </RNTouchableOpacity>
    )
}

// @ts-ignore
export const buttonStyles = (props) =>  StyleSheet.create({
  touchableOpacity: { 
    backgroundColor: props.intercom_disabled? '#f4f4f4' : '#0096FF',
    borderRadius: 5,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3
   }, 
   text: {
    color: props.intercom_disabled ? '#808080' : 'white'
   },
});

export default memo(Button);