import { useState, useEffect } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import FormLabel from '@mui/material/FormLabel';
import Container from '@mui/material/Container';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [multiline, setMultiline] = useState(false);
  const [emptyline, setEmptyline] = useState(false);
  const [trim, setTrim] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-1');

  async function digestMessage(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest(algorithm.toString(), data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  async function updateOutput() {
    if (multiline) {
      const lines = input.split(/\r?\n/);
      const promises = lines.map((line) => {
        let message = line;
        if (trim) {
          message = line.trim();
        }
        if (!emptyline && message === '') {
          setOutput('');
          return;
        }
        return digestMessage(message);
      });
      await Promise.all(promises).then((values) => { setOutput(values.join('\n')) });
    } else {
      let message = input;
      if (trim) {
        message = input.trim();
      }
      if (!emptyline && message === '') {
        setOutput('');
        return;
      }
      await digestMessage(message).then((value) => { setOutput(value) });
    }
  }

  useEffect(() => {
    void updateOutput();
  });

  return (
    <>
      <Container maxWidth="sm" sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          digest
        </Typography>
        <Box>
          <FormGroup sx={{ my: 2 }}>
            <FormLabel component="legend">Input options</FormLabel>
            <FormControlLabel
              id="multiline"
              control={<Switch />}
              label="MultiLine"
              checked={multiline}
              onChange={() => {
                setMultiline(prevState => !prevState);
              }}
            />
            <FormControlLabel
              id="emptyline"
              control={<Switch />}
              label="EmptyLine"
              checked={emptyline}
              onChange={() => {
                setEmptyline(prevState => !prevState);
              }}
            />
            <FormControlLabel
              id="trim"
              control={<Switch />}
              label="Trim"
              checked={trim}
              onChange={() => {
                setTrim(prevState => !prevState);
              }}
            />
            <FormControl>
              <FormLabel id="algorithm">Algorithm</FormLabel>
              <RadioGroup
                row
                value={algorithm}
                onChange={(event) => {
                  setAlgorithm(event.target.value as Algorithm);
                }}
              >
                <FormControlLabel value="SHA-1" control={<Radio />} label="SHA-1" />
                <FormControlLabel value="SHA-256" control={<Radio />} label="SHA-256" />
                <FormControlLabel value="SHA-384" control={<Radio />} label="SHA-384" />
                <FormControlLabel value="SHA-512" control={<Radio />} label="SHA-512" />
              </RadioGroup>
            </FormControl>
          </FormGroup>
          <FormGroup sx={{ my: 2 }}>
            <TextareaAutosize
              id="input"
              minRows={4}
              maxRows={8}
              placeholder="Input"
              defaultValue=""
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
          </FormGroup>
          <FormGroup sx={{ my: 2 }}>
            <TextareaAutosize
              id="output"
              minRows={4}
              maxRows={8}
              placeholder="Output"
              value={output}
              readOnly
            />
          </FormGroup>
        </Box>
      </Container>
    </>
  )
}

export default App
