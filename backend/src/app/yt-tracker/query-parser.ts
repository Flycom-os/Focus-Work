export const parseQuery = (query: string, userId: string) => {
    const prismaWhere: any = { AND: [] };
    // This is a very basic parser and has limitations (e.g., does not handle values with spaces).
    const tokens = query.match(/(-?\w+:\S+)|(#\S+)|(\S+)/g) || [];

    tokens.forEach(token => {
        if (token.startsWith('project:')) {
            prismaWhere.AND.push({ project: { key: token.substring(8) } });
        } else if (token.startsWith('assignee:')) {
            let assignee = token.substring(9);
            if (assignee === 'me') {
                assignee = userId;
            }
            prismaWhere.AND.push({ assignee: { id: assignee } });
        } else if (token.startsWith('state:')) {
            prismaWhere.AND.push({ state: { name: token.substring(6) } });
        } else if (token.startsWith('-state:')) {
            prismaWhere.AND.push({ NOT: { state: { name: token.substring(7) } } });
        } else {
            // Assume it's a search in summary or description
            prismaWhere.AND.push({
                OR: [
                    { summary: { contains: token, mode: 'insensitive' } },
                    { description: { contains: token, mode: 'insensitive' } },
                ]
            });
        }
    });

    if (prismaWhere.AND.length === 0) {
        return {}; // Return empty filter if query is empty
    }

    return prismaWhere;
};
