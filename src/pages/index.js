import { Container, Text, Input, ActionIcon, Table, Space, Image, Group } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { useState } from 'react';
import {BsChevronRight} from 'react-icons/bs';

function splitArray(arr, chunkSize) {
  let result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    let chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

export default function Home() {

  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const { height, width } = useViewportSize();
  let mobile = width < 768 ? true : false;
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    if(data?.numbers?.length > 10) data.numbers = splitArray(data.numbers, 10);
    setResult(data);
  };

  return (
    <Container size={mobile ? "95%" : "60%"} style={{display: "flex", flexDirection: "column", textAlign: "center"}}>
  {!mobile &&  <Group position="center" style={{margin: "5vh 0"}}> <Image src='/logo.png' width={mobile ? 100 : 100} height={mobile ? 100 : 100} style={{margin: "0"}} />
    <Text component='h2' color='cyan' weight={600} size={mobile ? "4vw" : "2.5vw"}>Ondřej Zaplatílek</Text></Group>}
    {mobile &&  <div position="center" style={{margin: "5vh 0", display: "flex", alignItems: "center", justifyContent: "space-evenly", flexDirection: "column"}}> <Image src='/logo.png' width={mobile ? 50 : 100} height={mobile ? 50 : 100} style={{margin: "0"}} />
    <Text component='h2' color='cyan' weight={600} size={mobile ? "8vw" : "2.5vw"}>Ondřej Zaplatílek</Text></div>}
    <Text component='h1' weight={600} size={mobile ? "8vw" : "4vw"}>Desetiny na celá čísla</Text>
      <form onSubmit={handleSubmit}>
       <Text size={"xl"} sx={{maxWidth: "80%", margin: "0 auto 5vh auto"}}>Tento nástroj vám umožňuje jednoduše a rychle spočítat váš desetinový výsledek na celá čísla, stačí vložit odkaz na pdf dokument ze SIUSu.</Text>
          <Input
          size='xl'
            type="text"
            placeholder='http://results.sius.com/...pdf'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            rightSection={  <ActionIcon size={"xl"} variant="filled" color="cyan" component='button' type="submit"><BsChevronRight /></ActionIcon>}
          />
       
      
      </form>

      {result && (
        <div style={{margin: "5vh 0"}}>
          <Text size={mobile ? "8vw" : "xl"}>Celkem</Text>
          <Text sx={{lineHeight: "1"}} size={mobile ? "10vw" : "4vw"} weight={600}>{result.total}</Text>
         <Space h={"5vh"} />
        <div style={{ overflow: "scroll"}}>
        <Table miw={mobile ? 200 : 700}>
        <thead>
          <tr>
            <th style={{textAlign: "center"}}>{mobile ? "P" : "Položka"}</th>
            <th style={{textAlign: "center"}}>1</th>
            <th style={{textAlign: "center"}}>2</th>
            <th style={{textAlign: "center"}}>3</th>
            <th style={{textAlign: "center"}}>4</th>
            <th style={{textAlign: "center"}}>5</th>
            <th style={{textAlign: "center"}}>6</th>
            <th style={{textAlign: "center"}}>7</th>
            <th style={{textAlign: "center"}}>8</th>
            <th style={{textAlign: "center"}}>9</th>
            <th style={{textAlign: "center"}}>10</th>
            <th style={{textAlign: "center"}}>{mobile ? "Pr" : "Průměr" }</th>
            <th style={{textAlign: "center"}}>{mobile ? "T" : "Celkem"}</th>
          </tr>
        </thead>
        <tbody>
          {result?.numbers?.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {row.map((item, index) => (
                <td key={index}>{item}</td>
              ))}
              <td>{row.reduce((a, b) => a + b, 0) / row.length}</td>
              <td>{row.reduce((a, b) => a + b, 0)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
        </div>
        </div>
      )}
    </Container>
  );
}
