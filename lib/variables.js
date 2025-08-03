
window.variables = {
  values: {
    c: 299792458,
    h: 6.62607015e-34,
    hbar: 1.054571817e-34,
    G: 6.67430e-11,
    k_B: 1.380649e-23,
    N_A: 6.02214076e23,
    q: 1.602176634e-19,
    m_e: 9.10938356e-31,
    m_p: 1.67262192369e-27,
    epsilon_0: 8.8541878128e-12,
    mu_0: 1.25663706212e-6,
    R: 8.314462618,
    g: 9.80665
  },
  latex: {
  c: 'c',
  h: 'h',
  hbar: '\\hbar',
  G: 'G',
  k_B: 'k_{B}',
  N_A: 'N_{A}',
  q: 'q',
  m_e: 'm_{e}',
  m_p: 'm_{p}',
  epsilon_0: '\\varepsilon_{0}',
  mu_0: '\\mu_{0}',
  R: 'R',
  g: 'g'

}
}
//for shortcuts alt+letter to enter anything
const greekMap = {
  A: "alpha",
  B: "beta",
  G: "gamma",
  D: "delta",
  E: "epsilon", 
  U: "mu",
  O: "theta",
  I: "iota",
  K: "kappa",
  L: "lambda",
  R: "rho",
  S: "sigma",
  Y: "psi",
  W: "omega"
};
//used to add greek letter's spell which will be replaced by symbols in latex render
const greekLetters = [
  { symbol: "α", name: "alpha" }, 
  { symbol: "β", name: "beta" },
  { symbol: "γ", name: "gamma" }, 
  { symbol: "δ", name: "delta" },
  { symbol: "ε", name: "epsilon" }, 
  { symbol: "ζ", name: "zeta" },
  { symbol: "η", name: "eta" }, 
  { symbol: "θ", name: "theta" },
  { symbol: "ι", name: "iota" }, 
  { symbol: "κ", name: "kappa" },
  { symbol: "λ", name: "lambda" }, 
  { symbol: "μ", name: "mu" },
  { symbol: "ν", name: "nu" }, 
  { symbol: "ξ", name: "xi" },
  { symbol: "ο", name: "omicron" }, 
  { symbol: "π", name: "pi" },
  { symbol: "ρ", name: "rho" }, 
  { symbol: "σ", name: "sigma" },
  { symbol: "τ", name: "tau" }, 
  { symbol: "υ", name: "upsilon" },
  { symbol: "φ", name: "phi" }, 
  { symbol: "χ", name: "chi" },
  { symbol: "ψ", name: "psi" }, 
  { symbol: "ω", name: "omega" }
];