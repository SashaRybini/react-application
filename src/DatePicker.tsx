import { useState } from "react";
import DateItem from "./DateItem";
import { Box, Modal } from "@mui/material";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    bgcolor: 'white',
    // border: '2px solid #000',
    // boxShadow: 24,
    // p: 4,
}

export default function DatePicker() {
    const [pickedDateIndex, setPickedDateIndex] = useState(0);

    const [openModal, setOpenModal] = useState(false)

    const dateClickHandler = (index: number) => {
        setPickedDateIndex(index);
    };
    const submitClickHandler = () => {
        alert(`Selected day is ${pickedDateIndex + 1}`);
        // setOpenModal(true)
    };
    const DATE_NUMBER = 14;
    let spanArr = [];
    for (let i = 0; i < DATE_NUMBER; i++) {
        spanArr.push(i + 1);
    }
    return <div>
            <div>Date Picker</div>
            <br />
            <div>Pick any day you want but for some reason only day 1
                works</div>
            <br />
            {spanArr.map((date, index) => (
                <DateItem
                    key={date}
                    date={date}
                    selected={index === pickedDateIndex}
                    onClick={() => dateClickHandler(index)}
                />
            ))}
            <br />
            <br />
            <span>
                {pickedDateIndex !== 0
                    ? `Selected day is ${pickedDateIndex + 1}`
                    : "No day is selected"}
            </span>
            <br />
            <br />
            <button onClick={submitClickHandler}>Submit</button>
            <button onClick={() =>
                setPickedDateIndex(0)}>Clear</button>
            {/* <div>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <Box sx={modalStyle}>
                        <p>{`Selected day is ${pickedDateIndex + 1}`}</p>
                        <button onClick={() => setOpenModal(false)}>ok</button>
                    </Box>
                </Modal>
            </div> */}
        </div>
    
}

