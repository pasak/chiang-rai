const { getLabel } = require('../../librarys/Library')
const { getDateString, getYMDfromDMY, getTime } = require('../../librarys/DayTimeLibrary')

const TeamModel3 = require('../Team/TeamModel3')

module.exports = new class PollingStationController {

async exportGoogleSheet (req,res) {
    var PollingStationList, CSV, CSVList = []

    try {
        PollingStationList = await TeamModel3.searchPollingStationCSV()
    } catch (error) {
        res.status(500).send({ error: 'searchPollingStationCSV ' + error.message })
        return
    }

    PollingStationList.map((PollingStation) => {
        let DT = new Date(PollingStation.CreatedDateTime)

        PollingStation.Location         = (PollingStation.Latitude == null) ? '' : PollingStation.Latitude +','+ PollingStation.Longitude
        PollingStation.CreatedDateTime  = getDateString(DT,'th') + ' ' + getTime(DT),
        PollingStation.CreatedBy        = PollingStation.FirstName + ' ' + PollingStation.LastName

        if (PollingStation.GooglePlaceName == null) { PollingStation.GooglePlaceName = '' }
        if (PollingStation.Remark == null) { PollingStation.Remark = '' }

        CSV = [
            PollingStation.ID, 
            PollingStation.SubDistrict,
            PollingStation.VillageNumber,
            PollingStation.ElectionDistrictNumber,
            PollingStation.Community,
            PollingStation.PollingStationNumber,
            PollingStation.PollingStationName,
            PollingStation.RiskLevel,
            PollingStation.Remark,
            PollingStation.Location,
            PollingStation.GooglePlaceName, 
            PollingStation.CreatedDateTime,
            PollingStation.CreatedBy
        ]

        CSVList.push(CSV) 
    })

    const {google} = require('googleapis')

    const auth = new google.auth.GoogleAuth({
        keyFile: 'c.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient()

    const googleSheets = google.sheets({version: 'v4', auth: client})

    try {
        const response = await googleSheets.spreadsheets.values.update({
            auth, 
            spreadsheetId: process.env.POLLING_STATION_SHEET_ID,
            range: 'PollingStation!A2:M' + (CSVList.length + 1),
            valueInputOption: 'RAW',
            resource: { values: CSVList }
        })

        res.send(response)
    } catch (error) {
        res.status(500).send({ error: 'spreadsheets update : ' + error.message })
    }
} // exportGoogleSheet
    
} // PollingStationController