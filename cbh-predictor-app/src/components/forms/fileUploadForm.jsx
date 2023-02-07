import React, { useState } from 'react'
import Constants from '../../utilities/Constants';
import axiosApiInstance from '../../services/interceptor';
import styles from "./forms.module.css"

const FileUploadForm = (props) => {
    const [selectedFile, setSelectedFile] = useState();
	const [, setIsFilePicked] = useState(false);
    const [month, setMonth] = useState('Jan');
    const [year, setYear] = useState(2022);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    }
    const handleYearChange = (e) => {
        setYear(e.target.value);
    }

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	async function handleSubmission(e) {
        e.preventDefault();

        if(props.table === "Bing" || props.table === "Google"){
            if(year < 2000 || year > 3000){
                alert("Invalid year")
                return
            }

            for(let i = 0; i < months.length; i++){
                if(month.includes(months[i]))
                    break

                if(i === months.length -1){
                    alert("Invalid month")
                    return
                }         
            }
        } 

		const formData = new FormData();
        var url;

        switch (props.table) {
            case 'Bing':
                url = `${Constants.API_URL_BASE}/BingTable/${month}/${year}`;
                break;
            case 'Google':
                url = `${Constants.API_URL_BASE}/GoogleTable/${month}/${year}`
                break;
            case 'Lead':
                url = `${Constants.API_URL_BASE}/LeadTable`
                break;
            case 'Order':
                url = `${Constants.API_URL_BASE}/OrderTable`
                break;
            default:
                break;
        }

		formData.append('File', selectedFile);
        
        const result = await axiosApiInstance.post(url, formData)
        if(result.status === 200){
            props.onFileUploaded(true)
        }
        if(result.status === 500){
            alert("Uploaded file not in the correct format")
        }
	};

	return(
        <form className={styles.body}>
            <h1>Upload new File</h1>
            <div className={styles.container}>
                <input type="file" name="file" onChange={changeHandler} />
                {(props.table === 'Bing' || props.table === 'Google') && (showDateInput())}

                <button onClick={handleSubmission} className={styles.button_green}>Submit</button>
                <button onClick={() => props.onFileUploaded(false)} className={styles.button_gray}>Cancel</button>
            </div>
        </form>
	)

    function showDateInput(){
        return(
            <>
                <div className="mt-4">
                    <label className="h3 form-label">Entry month</label>
                    <input value={month} name="month" type="text" className="form-control" onChange={handleMonthChange} />
                </div>
                
                <div className="mt-4">
                    <label className="h3 form-label">Entry year</label>
                    <input value={year} name="year" type="text" className="form-control" onChange={handleYearChange} />
                </div>
            </>
        )
    }
}

export default FileUploadForm