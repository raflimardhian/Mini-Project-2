const { mock } = require('bun:test');

/**
 * PRISMA MOCK (CommonJS Version)
 */

const mockUser = {
    findMany: mock(() => []),
    findUnique: mock(() => null),
    findFirst: mock(() => null),
    findByUsername: mock(() => null),
    create: mock(() => ({})),
    update: mock(() => ({})),
    delete: mock(() => ({}))
};

const mockProduct = {
    findMany: mock(() => []),
    findUnique: mock(() => null),
    create: mock(() => ({})),
    update: mock(() => ({})),
    delete: mock(() => ({}))
};
const mockOrder = {
    create: mock(() => ({})),
    findMany: mock(() => []),
    findUnique: mock(() => null)
};

const mockEtalase = {
    findMany: mock(() => []),
    create: mock(() => ({}))
};

const prismaMock = {
    user: mockUser,
    product: mockProduct,
    order: mockOrder,
    reseller: mockUser, 
    etalase: mockEtalase,
    etalaseProduct: { findMany: mock(() => []) }
};

// const resetMocks = () => {
//     mockUser.findMany.mockReset();
//     mockUser.findUnique.mockReset();
//     mockUser.create.mockReset();
//     mockUser.update.mockReset();
//     mockUser.delete.mockReset();
// };

const resetMocks = () => {
    Object.values(mockUser).forEach(m => {
        if (m && m.mockReset) m.mockReset();
    });
    
    Object.values(mockProduct).forEach(m => {
        if (m && m.mockReset) m.mockReset();
    });

    Object.values(mockOrder).forEach(m => {
        if (m && m.mockReset) m.mockReset();
    });
};

module.exports = {
    mockUser,
    mockProduct,
    prismaMock,
    resetMocks
};