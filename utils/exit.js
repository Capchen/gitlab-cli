export function exit(code) {
  if (code > 0) {
    throw new Error(`Process exited with code ${code}`)
  }
}
