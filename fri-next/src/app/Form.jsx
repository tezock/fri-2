import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY; 
// const supabase = createClient(supabaseUrl, supabaseAnonKey);


const form_fields = {
    age: '',
    major: '',
    personalityType: 'Introvert', // default value
    engagementLevel: '1',
    conversationLeader: '1',
    responseAccuracy: '1',
    responseReadPercentage: '0',
    likelihoodToInteract: '1',
    interactionQuality: '1'
  }

  const formFields = {
    age: "",
    major: "",
    fakeToNatural: null,
    machinelikeToHumanlike: null,
    unconsciousToConscious: null,
    artificialToLifelike: null,
    stagnantToAnimacy: null,
    mechanicalToLively: null,
    artificialToOrganic: null,
    inertToInteractive: null,
    apatheticToResponsive: null,
    dislikeToLikeability: null,
    unfriendlyToFriendly: null,
    unkindToKind: null,
    unpleasantToPleasant: null,
    awfulToNice: null,
    incompetentToCompetent: null,
    ignorantToKnowledgeable: null,
    irresponsibleToResponsible: null,
    unintelligentToIntelligent: null,
    foolishToSensible: null,
    promptId: null,
  };

  const beforeAndAfter = {
    fakeToNatural: ["Fake", "Natural"],
    machinelikeToHumanlike: ["Machinelike", "Humanlike"], 
    unconsciousToConscious: ["Unconscious", "Conscious"],
    artificialToLifelike: ["Artificial", "Lifelike"],
    stagnantToAnimacy: ["Stagnant", "Animate"],
    mechanicalToLively: ["Mechanical", "Lively"],
    artificialToOrganic: ["Artificial", "Organic"],
    inertToInteractive: ["Inert", "Interactive"],
    apatheticToResponsive: ["Apathetic", "Responsive"],
    dislikeToLikeability: ["Dislikeable", "Likeable"],
    unfriendlyToFriendly: ["Unfriendly", "Friendly"],
    unkindToKind: ["Unkind", "Kind"],
    unpleasantToPleasant: ["Unpleasant", "Pleasant"],
    awfulToNice: ["Awful", "Nice"],
    incompetentToCompetent: ["Incompetent", "Competent"],
    ignorantToKnowledgeable: ["Ignorant", "Knowledgeable"],
    irresponsibleToResponsible: ["Irresponsible", "Responsible"],
    unintelligentToIntelligent: ["Unintelligent", "Intelligent"],
    foolishToSensible: ["Foolish", "Sensible"]
   }
  
// const InteractionSurveyForm = ({onSave}) => {
//     const [formDone, setFormDone] = useState(false);
//     const [formData, setFormData] = useState(form_fields);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Form data submitted:", formData);
//         // Add form submission logic here'
//         setFormData(form_fields);
//         setFormDone(true);
//         await onSave(formData);
//     };

//     if (formDone) {

//         return (
//             <>
//             Thank you!
//             </>
//         )
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>
//                 Age:
//                 <input
//                     type="number"
//                     name="age"
//                     value={formData.age}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Major/Field of Interest:
//                 <input
//                     type="text"
//                     name="major"
//                     value={formData.major}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Introvert/Extrovert:
//                 <select
//                     name="personalityType"
//                     value={formData.personalityType}
//                     onChange={handleChange}
//                     required
//                 >
//                     <option value="Introvert">Introvert</option>
//                     <option value="Extrovert">Extrovert</option>
//                 </select>
//             </label>
//             <br />

//             <label>
//                 Level of Engagement (1-5):
//                 <input
//                     type="number"
//                     name="engagementLevel"
//                     min="1"
//                     max="5"
//                     value={formData.engagementLevel}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Leader of Conversation (1-5):
//                 <input
//                     type="number"
//                     name="conversationLeader"
//                     min="1"
//                     max="5"
//                     value={formData.conversationLeader}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Accuracy of Responses (1-5):
//                 <input
//                     type="number"
//                     name="responseAccuracy"
//                     min="1"
//                     max="5"
//                     value={formData.responseAccuracy}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Average Percentage of Robot's Responses Read (0-100):
//                 <input
//                     type="number"
//                     name="responseReadPercentage"
//                     min="0"
//                     max="100"
//                     value={formData.responseReadPercentage}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Likelihood of Interacting with this Robot Again (1-5):
//                 <input
//                     type="number"
//                     name="likelihoodToInteract"
//                     min="1"
//                     max="5"
//                     value={formData.likelihoodToInteract}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <label>
//                 Overall Quality of Interaction (1-10):
//                 <input
//                     type="number"
//                     name="interactionQuality"
//                     min="1"
//                     max="10"
//                     value={formData.interactionQuality}
//                     onChange={handleChange}
//                     required
//                 />
//             </label>
//             <br />

//             <button type="submit">Submit</button>
//         </form>
//     );
// };

const InteractionSurveyForm = ({ onSave, pid }) => {
    const [formDone, setFormDone] = useState(false);
    const [formData, setFormData] = useState(formFields);
  
    const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
      console.log("new form data");
      console.log(formData);
    };

    useEffect(() => {
      if (pid) {
        setFormData(prev => ({...prev, promptId: pid}));
      }
    }, [pid]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form data submitted:", formData);
      setFormData(formData);
      setFormDone(true);
      await onSave(formData);
    };
  
    if (formDone) {
      return <p>Thank you for your response!</p>;
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            required
          />
        </label>
        <br />
  
        <label>
          Major/Field of Interest:
          <input
            type="text"
            name="major"
            value={formData.major}
            onChange={(e) => handleChange("major", e.target.value)}
            required
          />
        </label>
        <br />
        
        <h3> Now, please rate the chatbot on the following categories:</h3>
        {Object.entries(formData).map(([key, value]) => {
          if (key === "age" || key === "major" || key === "promptId") return null;
  
          return (
            <div key={key}>
              {/* <label>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </label> */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "2vh", justifyContent: "space-around", alignItems: "center"}}>

                <label style={{ width: "80px" }}>{beforeAndAfter[key][0]}</label>
                {[1, 2, 3, 4, 5, 6, 7].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleChange(key, option)}
                    style={{
                      padding: "3px 8px",
                      backgroundColor: value === option ? "#4caf50" : "#f0f0f0",
                      color: value === option ? "#fff" : "#000",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
                <label style={{ width: "80px" }}>{beforeAndAfter[key][1]}</label>
              </div>
            </div>
          );
        })}
  
        <button type="submit" style={{ marginTop: "20px" }}>
          Submit
        </button>
      </form>
    );
  };

export default InteractionSurveyForm;
