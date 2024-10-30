import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);


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
  
const InteractionSurveyForm = ({onSave}) => {
    const [formDone, setFormDone] = useState(false);
    const [formData, setFormData] = useState(form_fields);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
        // Add form submission logic here'
        setFormData(form_fields);
        setFormDone(true);
        await onSave(formData);
    };

    if (formDone) {

        return (
            <>
            Thank you!
            </>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Introvert/Extrovert:
                <select
                    name="personalityType"
                    value={formData.personalityType}
                    onChange={handleChange}
                    required
                >
                    <option value="Introvert">Introvert</option>
                    <option value="Extrovert">Extrovert</option>
                </select>
            </label>
            <br />

            <label>
                Level of Engagement (1-5):
                <input
                    type="number"
                    name="engagementLevel"
                    min="1"
                    max="5"
                    value={formData.engagementLevel}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Leader of Conversation (1-5):
                <input
                    type="number"
                    name="conversationLeader"
                    min="1"
                    max="5"
                    value={formData.conversationLeader}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Accuracy of Responses (1-5):
                <input
                    type="number"
                    name="responseAccuracy"
                    min="1"
                    max="5"
                    value={formData.responseAccuracy}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Average Percentage of Robot's Responses Read (0-100):
                <input
                    type="number"
                    name="responseReadPercentage"
                    min="0"
                    max="100"
                    value={formData.responseReadPercentage}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Likelihood of Interacting with this Robot Again (1-5):
                <input
                    type="number"
                    name="likelihoodToInteract"
                    min="1"
                    max="5"
                    value={formData.likelihoodToInteract}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <label>
                Overall Quality of Interaction (1-10):
                <input
                    type="number"
                    name="interactionQuality"
                    min="1"
                    max="10"
                    value={formData.interactionQuality}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />

            <button type="submit">Submit</button>
        </form>
    );
};

export default InteractionSurveyForm;
