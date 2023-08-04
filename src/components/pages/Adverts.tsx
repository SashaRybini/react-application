import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Modal, Typography } from "@mui/material"
import Advert from "../../model/Advert"
import { useEffect, useRef, useState } from "react"
import Confirm from "../common/Confirm"
import { AdvertForm } from "../forms/AdvertForm"
import { advertsService } from "../../config/service-config"
import { useDispatchCode } from "../../hooks/hooks"

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
                        advert.current = params.row as Advert
                        setOpenDetailsModal(true)
                    }} label="Details" />,
                    <GridActionsCellItem icon={<DeleteIcon />} onClick={() => {
                        removeAdvert(params.row)
                    }} label="Delete" />,
                    <GridActionsCellItem icon={<EditIcon />} onClick={() => {
                        updateAdvert(params.row)
                    }} label="Update" />
                ]
            }
        }
    ]
    const [openDetailsModal, setOpenDetailsModal] = useState(false);

    const [adverts, setAdverts] = useState<Advert[]>([]);
    useEffect(() => {
        const subscription = advertsService.getAdverts().subscribe({
            next(advArray: Advert[] | string) {
                if (typeof advArray === 'string') {
                    dispatch(advArray, "");
                } else {
                    setAdverts(advArray)
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmContent, setConfirmContent] = useState('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const advertId = useRef(0)
    function removeAdvert(adv: Advert) {
        console.log(adv)
        setConfirmTitle('delete advert?')
        setConfirmContent(`you are going to delete #${adv.id}`)
        advertId.current = adv.id
        setOpenConfirmDialog(true)
    }
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const advert = useRef<Advert>()
    function updateAdvert(adv: Advert) {
        setConfirmTitle('update product?')
        setConfirmContent(`we are going to update #${adv.id}`)
        setOpenUpdateModal(true)
        advert.current = adv
    }
    function updateSubmitFn(adv: Advert) {
        advert.current = adv
        setIsUpdate(true)
        setOpenConfirmDialog(true)
        setOpenUpdateModal(false)
    }
    const dispatch = useDispatchCode()
    async function onSubmitConfirmDialog(confirmation: boolean) { //fn performs deleting and updating
        setOpenConfirmDialog(false)
        if (confirmation && !isUpdate) {
            try {
                const res: string = await advertsService.deleteAdvert(advertId.current)
                dispatch('', res)
            } catch (error: any) {
                dispatch(error, '')
            }
        } else if (confirmation && isUpdate) {
            setIsUpdate(false)
            try {
                const res: string = await advertsService.updateAdvert(advert.current!)
                dispatch('', res)
            } catch (error: any) {
                dispatch(error, '')
            }
        }
    }

    return <Box className='center-style'>
        <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={adverts} />
        </Box>
        <Modal
            open={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='modal-window'>
                {/* {adverts.map(a => {
                    const detailsObj = JSON.parse(a.details)
                    return Object.entries(detailsObj).map(([key, value]) => {
                        const text = `${key}: ${value}`
                        return <Typography key={key}>{text}</Typography>
                    })
                })} */}
                {advert.current && Object.entries(JSON.parse(advert.current!.details)).map(([key, value]) => {
                    const text = `${key}: ${value}`
                    return <Typography key={key}>{text}</Typography>
                })}
            </Box>
        </Modal>
        <Confirm
            title={confirmTitle}
            content={confirmContent}
            handleClose={onSubmitConfirmDialog}
            open={openConfirmDialog}
        />
        <Modal
            open={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='modal-window'>
                <Typography
                    variant="h6"
                >
                    {`we are on updating #${advert.current?.id}`}
                </Typography>
                <AdvertForm
                    submitFn={updateSubmitFn}
                    advertUpdated={advert.current}
                />
            </Box>
        </Modal>
    </Box>
}
export default Adverts