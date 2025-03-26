import judgeapi from '../API/judge0';
import axios from 'axios';

interface submitCodeArgs {
  code: string;
  language_id: number;
  input: string;
  expected_output: string;
  userId: string;
  difficulty: string;
}

async function submitCode(params: submitCodeArgs) {
  try {
    console.log('Code being submitted:', params.code);
    const response = await judgeapi.post('/submissions', {
      source_code: params.code,
      language_id: params.language_id,
      stdin: params.input.replace('\\n', '\n'),
      expected_output: params.expected_output,
    });

    if (response.data.status.id === 3) { // Assuming 3 is the ID for "Accepted" status
      await axios.patch(`/api/users/${params.userId}/update-score`, {
        difficulty: params.difficulty
      });
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export default submitCode;
