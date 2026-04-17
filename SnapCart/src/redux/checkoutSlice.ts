import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Position = [number, number] | null;

export type Address = {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
};

type CheckoutState = {
  position: Position;
  address: Address;
};

const initialState: CheckoutState = {
  position: null,
  address: {
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  },
};


const checkoutSlice=createSlice({
    name:"checkout",
    initialState,
    reducers:{
        setReduxPosition:(state,action:PayloadAction<Position>)=>{
            state.position=action.payload
        },
        setReduxAddress:(state,action:PayloadAction<Address>)=>{
            state.address=action.payload
        }
    }
});

export const {setReduxPosition,setReduxAddress}=checkoutSlice.actions;
export default checkoutSlice.reducer;
