import React from 'react';

export default function Report() {
    const containerStyle = {
        margin: '0 auto',
        maxWidth: '800px',
        backgroundColor: '#fff', // Set background color to white
        padding: '20px', // Optional padding for better visual appearance
        color: '#000'
      };
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    border: '1px solid #dddddd',
  };
  
  const imageStyle = {
    width: '20%',
    height: 'auto',
  };

  const cellStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
  };

  const bottomContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  };

  const dateStyle = {
    textAlign: 'left',
  };

  const signatureStyle = {
    textAlign: 'right',
  };

  return (
    <div style={containerStyle}>
      <div>
        <center><br />
        <img src="/govtLogo.png" alt="Your Image" style={imageStyle} />
          <br />
          <h1>ANNEXURE-B</h1><br />
          <br />
          <h1>RESIDENCE CERTIFICATE</h1>
          <h4>[Under Article 371(J)]</h4>
          <h4>[Under Article 371(J)]</h4><br />
          <h4>[The Karnataka Public Employment (Reservation in Appointment</h4>
          <h4>for Hyderabad-Karnataka Region) Rules</h4>
          <h4>for Hyderabad-Karnataka Region) Rules</h4>
        </center>
        <br /><br />
        <p>
          <h3>This is to certify that Sri/Smt s/o/w/o ............  has been residing at the following address in.............  Village/Town of District during the period noted below:
            Taluka of ...........  District during the period noted below :</h3></p>
        <br />

        <center>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>sl no</th>
                <th style={cellStyle}>Address</th>
                <th style={cellStyle}>From Date to which Date</th>
                <th style={cellStyle}>Evidence Summary <br /> (attach all certified copies of the evidence relied on)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>1</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>2</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>3</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>4</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>5</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
              <tr>
                <td style={cellStyle}>6</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
            </tbody>
          </table>
        </center>
        <br />

        <h3>Tabulate all enclosures adduced in evidence</h3>

        <div style={bottomContainerStyle}>
          <div style={dateStyle}>
            <h3>Place: ......</h3>
            <h3>Date: .......</h3>
          </div>
          <div style={signatureStyle}>
            <h3>Tahsildar</h3>
            <h3>........ Taluka</h3>
            <h3>........ District</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
