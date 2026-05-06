import crypto from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(crypto.scrypt);
const defaultTokenTtlHours = 12;

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(content, secret) {
  return crypto.createHmac("sha256", secret).update(content).digest("base64url");
}

function assertSafeEqual(expected, received) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new Error("Sessao invalida.");
  }
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, storedDigest] = String(storedHash ?? "").split(":");

  if (!salt || !storedDigest) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);

  try {
    assertSafeEqual(storedDigest, Buffer.from(derivedKey).toString("hex"));
    return true;
  } catch (_error) {
    return false;
  }
}

function assertRegisterPayload(payload) {
  const name = normalizeName(payload?.name);
  const email = normalizeEmail(payload?.email);
  const password = String(payload?.password ?? "");

  if (name.length < 3) {
    throw new Error("Informe um nome com pelo menos 3 caracteres.");
  }

  if (!email || !email.includes("@")) {
    throw new Error("Informe um email valido.");
  }

  if (password.length < 6) {
    throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  }

  return { name, email, password };
}

function assertLoginPayload(payload) {
  const email = normalizeEmail(payload?.email);
  const password = String(payload?.password ?? "");

  if (!email || !password) {
    throw new Error("Informe email e senha.");
  }

  return { email, password };
}

export class AuthService {
  constructor({ usersRepository, authSecret, tokenTtlHours = defaultTokenTtlHours }) {
    this.usersRepository = usersRepository;
    this.authSecret = authSecret;
    this.tokenTtlHours = tokenTtlHours;
  }

  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  issueToken(user) {
    const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = encodeBase64Url(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + this.tokenTtlHours * 60 * 60
      })
    );
    const content = `${header}.${payload}`;
    const signature = createSignature(content, this.authSecret);

    return `${content}.${signature}`;
  }

  async authenticate(token) {
    if (!token) {
      throw new Error("Sessao ausente.");
    }

    const [header, payload, signature] = String(token).split(".");

    if (!header || !payload || !signature) {
      throw new Error("Sessao invalida.");
    }

    const content = `${header}.${payload}`;
    const expectedSignature = createSignature(content, this.authSecret);

    assertSafeEqual(expectedSignature, signature);

    let decodedPayload;

    try {
      decodedPayload = JSON.parse(decodeBase64Url(payload));
    } catch (_error) {
      throw new Error("Sessao invalida.");
    }

    if (!decodedPayload?.sub || !decodedPayload.exp) {
      throw new Error("Sessao invalida.");
    }

    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Sessao expirada.");
    }

    const user = await this.usersRepository.findById(Number(decodedPayload.sub));

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    return this.serializeUser(user);
  }

  buildAuthResponse(user) {
    const serializedUser = this.serializeUser(user);

    return {
      token: this.issueToken(serializedUser),
      user: serializedUser
    };
  }

  async register(payload) {
    const { name, email, password } = assertRegisterPayload(payload);
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Ja existe um usuario cadastrado com este email.");
    }

    const createdUser = await this.usersRepository.create({
      name,
      email,
      passwordHash: await hashPassword(password)
    });

    return this.buildAuthResponse(createdUser);
  }

  async login(payload) {
    const { email, password } = assertLoginPayload(payload);
    const user = await this.usersRepository.findByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new Error("Email ou senha invalidos.");
    }

    return this.buildAuthResponse(user);
  }
}
