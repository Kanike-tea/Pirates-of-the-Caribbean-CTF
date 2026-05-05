export interface Challenge {
  id: number;
  title: string;
  story: string;
  challenge: string;
  hint: string;
  flag: string; // exact answer string — NEVER sent to client
  category: string;
  difficulty: "Medium" | "Hard";
}

/**
 * 10 pirate-themed CTF challenges (medium → hard).
 * The `flag` field is used server-side only for validation.
 * Client components receive a sanitized version without flags.
 */
export const challenges: Challenge[] = [
  {
    id: 1,
    title: "The Quartermaster's Corrupted Logbook",
    story:
      "Ye've boarded a derelict sloop and found the Quartermaster's logbook — but the last entry be encoded in a strange cipher. The Quartermaster was known to use a classic substitution with a shift of 13, the number of knots in a hangman's noose.",
    challenge:
      "Decode the following message:\n\n`SYNT{G0eghtN_Fg0ez_Oybjf}`\n\nThe Quartermaster used a well-known rotation cipher to hide his secrets.",
    hint: "ROT13 — a Caesar cipher with a shift of 13. Apply it letter-by-letter, preserving case and non-alpha characters.",
    flag: "FLAG{T0rtuGA_St0rm_Blows}",
    category: "Cryptography",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "The Harbourmaster's Ledger",
    story:
      "The harbourmaster of Port Royal keeps a secret ledger with a web interface. He's a sloppy coder who trusts user input far too much. Ye need to craft a query that bypasses his authentication and reveals the hidden manifest.",
    challenge:
      'The login form sends this SQL query:\n\n```sql\nSELECT * FROM crew WHERE name = \'${input}\' AND rank = \'captain\';\n```\n\nWhat single input string will return all rows from the crew table, regardless of rank? Provide the exact payload (without surrounding quotes).',
    hint: "Classic SQL injection — close the string, add an OR condition that is always true, and comment out the rest.",
    flag: "FLAG{' OR '1'='1' --}",
    category: "Web Exploitation",
    difficulty: "Medium",
  },
  {
    id: 3,
    title: "The Cursed Hex of Davy Jones",
    story:
      "A message in a bottle was found floating near the Locker. Inside is a parchment with nothing but hexadecimal runes. Davy Jones encoded his treasure coordinates in hex before casting them into the deep.",
    challenge:
      "Decode this hex string to reveal the flag:\n\n`464c41477b4433767953_4a306e33735f4c30636b33727d`\n\nRemove the underscore first, then convert from hex to ASCII.",
    hint: "Remove the underscore, then convert each pair of hex characters to its ASCII equivalent. 46 = 'F', 4c = 'L', etc.",
    flag: "FLAG{D3vyS_J0n3s_L0ck3r}",
    category: "Cryptography",
    difficulty: "Medium",
  },
  {
    id: 4,
    title: "The Boatswain's Buffer Blunder",
    story:
      "The ship's boatswain wrote a C program to manage cannon inventory, but he made a fatal mistake with memory. The Royal Navy's hackers have been exploiting it to seize pirate ships. Identify the vulnerability.",
    challenge:
      '```c\n#include <stdio.h>\n#include <string.h>\n\nvoid load_cannons() {\n    char order[16];\n    int authorized = 0;\n    \n    printf("Enter cannon order code: ");\n    gets(order);\n    \n    if (authorized) {\n        printf("Cannons loaded! Fire at will!\\n");\n    }\n}\n```\n\nWhat is the name of the classic vulnerability in this code? Answer in the format: `FLAG{vulnerability_name}` using lowercase with underscores.',
    hint: "The `gets()` function reads without bounds checking. The `order` buffer is only 16 bytes, but `authorized` sits right next to it on the stack...",
    flag: "FLAG{buffer_overflow}",
    category: "Binary Exploitation",
    difficulty: "Medium",
  },
  {
    id: 5,
    title: "The Siren's Script",
    story:
      "A mermaid siren has enchanted the crew's web portal with a malicious script that steals session tokens. The navigator noticed that the ship's guestbook allows HTML input without sanitisation. Craft a proof-of-concept payload.",
    challenge:
      'The guestbook renders user input directly into the page:\n\n```html\n<div class="entry">${userInput}</div>\n```\n\nWrite the classic XSS payload that will pop an alert box showing the document cookie. Provide the exact payload as the flag in the format: `FLAG{payload}`',
    hint: "Use a `<script>` tag with `alert(document.cookie)` inside it.",
    flag: "FLAG{<script>alert(document.cookie)</script>}",
    category: "Web Exploitation",
    difficulty: "Medium",
  },
  {
    id: 6,
    title: "The Navigator's Encoded Star Chart",
    story:
      "The navigator hid the coordinates to Isla de Muerta using a layered encoding scheme. First Base64, then reversed. Ye must undo both layers to reveal the flag.",
    challenge:
      "The encoded star chart reads:\n\n`==QdzVGbh1kclRXYyBSYsFWe0FGc`\n\nThis string has been reversed and then... well, the navigator was fond of a 64-character alphabet. Undo the transformations to reveal the flag.",
    hint: "Step 1: Reverse the string. Step 2: Base64 decode the result.",
    flag: "FLAG{1sl4_D3_Mu3rt4}",
    category: "Cryptography",
    difficulty: "Hard",
  },
  {
    id: 7,
    title: "The Blacksmith's Forged Token",
    story:
      "The blacksmith forges JSON Web Tokens for the crew's identity papers. But he made a critical mistake — he used the 'none' algorithm, meaning the tokens need no signature. Forge your own captain's token.",
    challenge:
      'A JWT is composed of three parts: `header.payload.signature`\n\nThe header is: `{"alg":"none","typ":"JWT"}`\nThe payload must be: `{"role":"captain","ship":"Black Pearl"}`\n\nWhat is the name of this JWT vulnerability? Answer as: `FLAG{vulnerability_name}` in lowercase with underscores.',
    hint: "When `alg` is set to `none`, the signature verification is bypassed entirely. This is a well-known JWT attack.",
    flag: "FLAG{jwt_algorithm_none_attack}",
    category: "Web Exploitation",
    difficulty: "Hard",
  },
  {
    id: 8,
    title: "The Powder Monkey's Python Pickle",
    story:
      "The powder monkey serialized the ship's ammunition records using Python's pickle module and stored them in an untrusted cache. A rival pirate crew has been injecting malicious pickled objects to execute code on our ship's systems.",
    challenge:
      '```python\nimport pickle\nimport base64\n\n# Received from untrusted source\ncargo_data = input("Enter serialized cargo manifest: ")\nmanifest = pickle.loads(base64.b64decode(cargo_data))\nprint(f"Cargo manifest: {manifest}")\n```\n\nWhat class of vulnerability does this code exhibit? An attacker can craft a pickle payload that calls `os.system()` upon deserialization.\n\nAnswer in the format: `FLAG{vulnerability_class}` using lowercase with underscores.',
    hint: "Python's pickle module can deserialize arbitrary objects, including those that execute system commands via `__reduce__`. This is a specific class of vulnerability.",
    flag: "FLAG{insecure_deserialization}",
    category: "Reverse Engineering",
    difficulty: "Hard",
  },
  {
    id: 9,
    title: "The Cartographer's Hidden Path",
    story:
      "The royal cartographer hid a secret API endpoint on the ship's navigation server. The endpoint isn't linked from any page, but the server's directory structure follows a predictable pattern. A careless `.git` directory was left exposed.",
    challenge:
      'A web server exposes these endpoints:\n\n```\nGET /api/v1/maps\nGET /api/v1/crew\nGET /api/v1/routes\n```\n\nYou found a `.git/config` file that reveals a private endpoint:\n\n```\n[remote "origin"]\n    url = git@pirate-server.local:nav/api-v1-treasure-coordinates.git\n```\n\nThe endpoint follows the same pattern as the others. What is the hidden endpoint path, and what is the general name for this attack technique?\n\nAnswer as: `FLAG{/api/v1/treasure-coordinates:forced_browsing}`',
    hint: "The git repo name maps to the URL path pattern. The technique of guessing hidden URLs is called forced browsing (also known as directory enumeration).",
    flag: "FLAG{/api/v1/treasure-coordinates:forced_browsing}",
    category: "Reconnaissance",
    difficulty: "Hard",
  },
  {
    id: 10,
    title: "The Kraken's Final Cipher",
    story:
      "Ye've reached the final chamber of the Kraken's lair. The treasure chest is locked with a multi-layer cipher. The Kraken was a master of obfuscation — three layers deep. Crack all three to claim the Black Pearl.",
    challenge:
      'Layer 1 — Hex decode:\n`5a6d78685a337444636d46724d3356754e31637a587a52735433303d`\n\nLayer 2 — The result of Layer 1 is encoded in another common scheme (64-character alphabet).\n\nLayer 3 — The result of Layer 2 is the final flag.\n\nDecode all three layers to reveal the flag.',
    hint: "Layer 1: Hex → ASCII gives you a Base64 string. Layer 2: Base64 decode that string. Layer 3: The result is your flag.",
    flag: "FLAG{Krak3un7W3_4lO}",
    category: "Cryptography",
    difficulty: "Hard",
  },
];

/** Sanitized challenge data safe to send to the client (no flags, no hints) */
export type ClientChallenge = Omit<Challenge, "flag" | "hint">;

export function getClientChallenges(): ClientChallenge[] {
  return challenges.map((c) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flag, hint, ...rest } = c;
    return rest;
  });
}

/** 
 * Calculate score: +10 points per completed challenge (id: 1-100), 
 * -5 points per hint used (represented by id + 100).
 */
export function calculateScore(completedChallenges: number[]): number {
  let score = 0;
  for (const id of completedChallenges || []) {
    if (id >= 1 && id <= 100) {
      score += 10;
    } else if (id > 100 && id <= 200) {
      score -= 5;
    }
  }
  return score;
}
