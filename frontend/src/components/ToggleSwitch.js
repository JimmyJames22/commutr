import styled from 'styled-components';

const InputWrapper = styled.label`
    position: relative;
    align-items: center;
    vertical-align: middle;
`;

const Container = styled.div`
    height: 45px;
    position: relative;
`;

const Center = styled.div`
    margin-left: 40%;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);    
`;

const Input = styled.input`
    position:absolute;
    left: -9999999px;
    top: -99999999px;

    &:checked + span {
        background-color: #44C4E1;

        &:before {
            left: calc(100% - 2px);
            transform: translateX(-100%);
        }
    }
`;

const Slider = styled.span`
    display:flex;
    cursor: pointer;
    width: 50px;
    height: 25px;
    border-radius: 100px;
    background-color: #28965A;
    position: relative;
    transition: background-color 0.2s;

    align-items: center;
    vertical-align: middle;
    
    &:before {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 21px;
        height: 21px;
        border-radius: 45px;
        transition: 0.2s;
        background: #F8F0E3;
        box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
    }
    &:active:before {
        width: 28px;
    }
`;

const ToggleSwitch = ({onChange}) => (
    <Container>
    <Center>
    <InputWrapper > 
        <Input type="checkbox" onChange={onChange}/>
        <Slider />
    </InputWrapper>
    </Center>
    </Container>
);

export default ToggleSwitch