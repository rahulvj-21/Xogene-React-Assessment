import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DrugDetail.css';

const DrugDetail = () => {
  const { drugName } = useParams();
  const [drugData, setDrugData] = useState(null);
  const [ndcs, setNdcs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrugData = async () => {
      try {
        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs?name=${drugName}`);
        const drugInfo = response.data.drugGroup.conceptGroup
          .flatMap(group => group.conceptProperties || [])
          .find(drug => drug.name.toLowerCase() === drugName.toLowerCase());
        if (drugInfo) {
          setDrugData(drugInfo);
          fetchNdcs(drugInfo.rxcui);
        } else {
          setError('No drug data found');
        }
      } catch (error) {
        console.error('Error fetching drug data:', error);
        setError('Failed to fetch drug data');
      }
    };

    const fetchNdcs = async (rxcui) => {
      try {
        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/ndcs`);
        setNdcs(response.data.ndcGroup.ndcList.ndc || []);
      } catch (error) {
        console.error('Error fetching NDCs:', error);
        setError('Failed to fetch NDCs');
      }
    };

    fetchDrugData();
  }, [drugName]);

  return (
    <div className="drug-detail-container">
      {error && <div className="error">{error}</div>}
      {drugData ? (
        <div>
          <h2>{drugData.name}</h2>
          <p><strong>RxCUI:</strong> {drugData.rxcui}</p>
          <p><strong>Synonym:</strong> {drugData.synonym}</p>
          <div>
            <h3>NDCs</h3>
            {ndcs.length > 0 ? (
              <ul>
                {ndcs.map(ndc => (
                  <li key={ndc}>{ndc}</li>
                ))}
              </ul>
            ) : (
              <p>No NDCs found for this drug.</p>
            )}
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default DrugDetail;
