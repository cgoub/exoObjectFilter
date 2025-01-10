import * as fs from "fs/promises";

type User = {
    team: string;
    name: string;
    age: number;
};

function filterObjects<T>(
    objects: T[],
    filters: { description: string; filter: (item: T) => boolean }[]
): T[] {
    const filterDescriptions = filters
        .map(f => f.description)
        .join(" AND ");

        console.log(`Filter: WHERE ${filterDescriptions}`);

    return objects.filter(obj => filters.every(f => f.filter(obj)));
}

async function loadFromJSON<T>(filePath: string): Promise<T[]> {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data) as T[];
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier JSON : ${ error }`);
        throw error;
    }
}

async function main() {
    // RAM
    const usersInRAM: User[] = [
        {team: "A", name: "Clement", age: 25 },
        {team: "A", name: "Yasmine", age: 30 },
        {team: "A", name: "John", age: 25 },
        {team: "A", name: "Johnatan", age: 45 },
        {team: "B", name: "Edouard", age: 25 },
        {team: "B", name: "Quentin", age: 25 },
        {team: "B", name: "John", age: 25 },
    ];

    // Charger fichier JSON
    const usersFromFile = await loadFromJSON<User>("users.json");

    const filters = [
        // {
        //     description: '"name" contains "en"',
        //     filter: (user: User) => user.name.includes("en"),
        // },
        {
            description: '"name" IS "John"',
            filter: (user: User) => user.name === "John",
          },
        {
            description: '"age" = 25',
            filter: (user: User) => user.age === 25,
        },
    ];

    // Filtrer RAM
    console.log("Filtrage depuis la RAM...");
    const filteredUsersInRAM = filterObjects(usersInRAM, filters);
    console.log("Résultats depuis la RAM :", filteredUsersInRAM);

    // Filtrer JSON
    console.log("Filtrage depuis le fichier JSON...");
    const filteredUsersFromFile = filterObjects(usersFromFile, filters);
    console.log("Résultats depuis le fichier JSON :", filteredUsersFromFile);
}

main().catch(err => console.error("Erreur dans le programme :", err));