function arthSequence(n, firstTerm, commonDifference) {
  return firstTerm + (n - 1) * commonDifference;
}


function generateArthSequence(n, firstTerm, commonDifference) {
  let sequence = [];
  for (let i = 0; i <= n; i++) {
    sequence.push(arthSequence(i + 1, firstTerm, commonDifference));
  }
  return sequence;
}

console.log(generateArthSequence(10, 0, 2));
