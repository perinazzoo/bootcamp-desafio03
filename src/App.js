import React from "react";
import axios from 'axios';

import api from './services/api';

import Icon from './components/Icon';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = React.useState([]);
  const titleRef = React.useRef(null);
  const techsRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const response = await api.get('/repositories');

      const data = response?.data?.map((item) => ({
        ...item,
        techsString: item.techs?.join(', '),
      }))

      setRepositories(data);
    })();
  }, []);

  async function handleAddRepository(e) {
    e.preventDefault();

    const response = await api.post('/repositories', {
      title: titleRef?.current?.value,
      techs: techsRef?.current?.value?.split(','),
      url: 'https://github.com/perinazzoo'
    });

    const repository = {
      ...response?.data,
      techsString: response?.data?.techs?.join(', '),
    }

    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);

      const newData = repositories.filter((r) => r?.id !== id);

      setRepositories(newData);
    } catch (err) {
      alert('Ocorreu um erro ao deletar.');
    }
  }

  return (
    <div className="container">
      <h1>Lista de repositórios</h1>

      <div>
        <div>
          <input ref={titleRef} placeholder="Insira o título do projeto" type="text" className="input-title" />
          <input ref={techsRef} placeholder="Tecnologias utilizadas no projeto, separadas por vírgula" type="text" className="input-techs" />
        </div>
        <button onClick={handleAddRepository}>Adicionar</button>
      </div>

      <ul data-testid="repository-list">
        {repositories?.map((item) => (
          <li key={item?.id}>
            <div>
              <a href={item?.url || '#'}><h2 className="item-title">{item?.title}</h2></a>

              <h3 className="item-techs">Tecnologias: </h3> <p className="item-tech-list">{item?.techsString}</p>
            </div>

            <button onClick={() => handleRemoveRepository(item?.id)}>
              <Icon className="icon" />
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
