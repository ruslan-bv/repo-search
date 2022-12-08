export const fetchRepoData = async (options: any) => {
    const { name, language } = options;

    const url = `api.github.com/search/repositories`

    const response = await fetch(`${url}?q=${name}+language:${language}&sort=stars`);

    const result = response.json();
    console.log(result);

    return result;
}
