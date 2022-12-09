import React from 'react';
import { Repos } from '../interfaces';
import '../App.css';

export const Table:React.FC<Repos> = (props: Repos) => {
    const { repos } = props;
    return (
        <section className="table-section">
            <table>
                <thead>
                <tr className="table-header">
                    <th><span className="table-header-title">Name</span></th>
                    <th>Description</th>
                    <th>Owner</th>
                    <th>Url</th>
                </tr>
                </thead>
                <tbody>
                    {repos.map((repo: any) => {
                        return (
                            <tr key={repo.id}>
                                <td>{repo.name}</td>
                                <td><div className="table-desc">{repo.description}</div></td>
                                <td>{repo.login}</td>
                                <td><a href={repo.url}>{repo.url}</a></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
    )
}