const hre = require("hardhat");

function toPairs(arr) {
  return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) =>
    arr.slice(i * 2, i * 2 + 2)
  );
}

async function main() {
  console.log("Starting");
  const arr = [1, 2, 3, 4, 5, 6, 7];
  console.log(toPairs(arr));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
