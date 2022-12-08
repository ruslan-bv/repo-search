import React from 'react';
import { fetchRepoData } from './server';
import { RepositoryOptions } from './interfaces';
import './App.css';

export const App:React.FC = () => {
  const [repo, setRepo] = React.useState<RepositoryOptions>({name: '', language: ''});
  
  const handleChangeRepoName = (e: any) => {
    setRepo((prevRepo) => {
      return {...prevRepo, name: e.target.value};
    })
  }

  const handleChangeRepoLanguage = (e: any) => {
    setRepo((prevRepo) => {
      return {...prevRepo, language: e.target.value};
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const repoData = await fetchRepoData(repo);
    console.log(repoData)
  }

  return (
    <div className="App">
      <h1>Github Repo Search</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={repo.name} onChange={handleChangeRepoName} />
        </label>
        <label>
          Language:
          <input type="text" value={repo.language} onChange={handleChangeRepoLanguage} />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
