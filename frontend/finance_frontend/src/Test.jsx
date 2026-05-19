

export default function Test() {
  console.log('Test component rendered');
  return (
    <div>
      <h1>If you see this, React is working</h1>
      <button onClick={() => alert('Button clicked!')}>Click me</button>
    </div>
  );
}