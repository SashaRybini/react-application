import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Modal, Typography } from "@mui/material"
import Advert from "../../model/Advert"
import { useState } from "react"

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Adverts: React.FC = () => {

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'category', headerName: 'Category', flex: 0.7, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'price', headerName: 'Price', flex: 1, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'name', headerName: 'Name', flex: 0.8, headerClassName: 'data-grid-header',
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions', type: 'actions', flex: 0.6, getActions: (params: GridRowParams) => {
                return [
                    <GridActionsCellItem icon={<VisibilityIcon />} onClick={() => {
                        setOpenModal(true)
                    }} label="Details" />,
                    <GridActionsCellItem icon={<DeleteIcon />} onClick={() => {
                        console.log("delete")
                    }} label="Delete" />,
                    <GridActionsCellItem icon={<EditIcon />} onClick={() => {
                        console.log("update")
                    }} label="Update" />
                ]
            }
        }
    ]
    const [openModal, setOpenModal] = useState(false);

    const adverts: Advert[] = [{id: 0, category: 'flats, houses', price: 123, name: 'qwe', details: '{"houseType":"flat","advertType":"rent","rooms":"2","square":"22"}'}]

    return <Box sx={centerStyle}>
        <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={adverts} />
        </Box>
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {adverts.map(a => {
                    const detailsObj = JSON.parse(a.details)
                    return Object.entries(detailsObj).map(([key, value]) => {
                        const text = `${key}: ${value}`
                        return <Typography key={key}>{text}</Typography>
                    })
                })}
            </Box>
        </Modal>
    </Box>
}
export default Adverts