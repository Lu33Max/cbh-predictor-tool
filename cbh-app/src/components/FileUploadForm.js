import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function FileUploadForm(props) {
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [month, setMonth] = useState('Jan');
    const [year, setYear] = useState(2022);

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

	const handleSubmission = (e) => {
        e.preventDefault();

		const formData = new FormData();
        var url;

        switch (window.$activeTable) {
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

		fetch(
			url,
			{
				method: 'POST',
				body: formData,
			}
		)
        .then((response) => response.json())
        .then((result) => {
            console.log('Success:', result);
            props.onFileUploaded(true);  
        })
        .catch((error) => {
            console.error('Error:', error);
        });  
	};

	return(
        <form className="w-100 px-5">
            <h1 className="mt-5">Upload new File</h1>
            <div>
                <input type="file" name="file" onChange={changeHandler} />

                {(window.$activeTable === "Bing" || window.$activeTable === "Google") && showDateInput()}

                <button onClick={handleSubmission} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
                <button onClick={() => props.onFileCreated(false)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
            </div>
        </form>
	)

    function showDateInput(){
        return(
            <div>
                <div className="mt-4">
                    <label className="h3 form-label">Entry month</label>
                    <input value={month} name="month" type="text" className="form-control" onChange={handleMonthChange} />
                </div>
                
                <div className="mt-4">
                    <label className="h3 form-label">Entry year</label>
                    <input value={year} name="year" type="text" className="form-control" onChange={handleYearChange} />
                </div>
            </div>
        )
    }
}