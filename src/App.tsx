import React from 'react';
import { Table } from './components/Table';
import { fetchRepoData } from './server';
import { RepositoryOptions, Repo } from './interfaces';
import './App.css';

export const App:React.FC = () => {
  const [repo, setRepo] = React.useState<RepositoryOptions>({name: '', language: ''});
  const [repos, setRepos] = React.useState<Repo[] | []>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);

  const handleChangeRepoName = (e) => {
    setRepo((prevRepo) => {
      return {...prevRepo, name: e.target.value};
    })
  }

  const handleChangeRepoLanguage = (e) => {
    setRepo((prevRepo) => {
      return {...prevRepo, language: e.target.value};
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { items, total_count } = await fetchRepoData(repo, page);
    const preppedRepos = items.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        login: repo.owner.login,
        url: repo.html_url
      }
    })
    setRepos(preppedRepos);
    setTotalCount(total_count);
  }

  const handleNextPage = async (type: string) => {
    const newPage = type === 'next' ? page + 1 : page - 1;
    setPage(newPage);
    const { items } = await fetchRepoData(repo, newPage);
    const preppedRepos = items.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        login: repo.owner.login,
        url: repo.html_url
      }
    })
    setRepos(preppedRepos);
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
      {repos.length > 0 && 
      <>
        <Table repos={repos} />
        <div>
          {page > 1 && <button onClick={() => handleNextPage('back')}>Back</button>}
          {page}
          <button onClick={() => handleNextPage('next')}>Next</button>
        </div>
      </>}
    </div>
  );
}

export default App;
