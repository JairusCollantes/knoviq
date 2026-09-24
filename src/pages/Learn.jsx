import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronDown, ChevronUp, CodeXml, SquareFunction } from 'lucide-react';
import './Learn.css';

const assignments = {
  'java-oop': {
    topic: { name: 'Java ', color: '#f89820', icon: <CodeXml size={14} /> },
    title: 'OOP Basics',
    difficulty: 'beginner',
    lesson: {
      introduction: 'Object-Oriented Programming (OOP) is a paradigm based on the concept of "objects", which contain data and code. Java is fundamentally an object-oriented language, making OOP concepts essential for any Java developer.',
      concepts: [
        {
          title: 'Classes and Objects',
          explanation: 'A class is a blueprint or template for creating objects. An object is an instance of a class, containing state (fields/variables) and behavior (methods). You use the "new" keyword to instantiate objects.'
        },
        {
          title: 'Encapsulation',
          explanation: 'Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting direct access to some components using access modifiers like private, protected, and public.'
        },
        {
          title: 'Constructors',
          explanation: 'A constructor is a special method invoked automatically when an object is created. It has the same name as the class and no return type. Java supports constructor overloading.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Object Only Programming', 'Optimal Object Protocol', 'Ordered Operation Process'], answer: 'Object Oriented Programming', explanation: 'OOP stands for Object Oriented Programming.' },
      { type: 'multiple_choice', question: 'What is a class in Java?', options: ['An instance of an object', 'A blueprint for creating objects', 'A static method', 'A primitive data type'], answer: 'A blueprint for creating objects', explanation: 'A class acts as a template or blueprint from which objects are created.' },
      { type: 'multiple_choice', question: 'Which keyword is used to create an object?', options: ['class', 'object', 'new', 'create'], answer: 'new', explanation: 'The "new" keyword is used to instantiate (create) an object from a class.' },
      { type: 'multiple_choice', question: 'What is encapsulation?', options: ['Hiding data and restricting access', 'Creating multiple objects', 'Inheriting from a parent', 'Overriding methods'], answer: 'Hiding data and restricting access', explanation: 'Encapsulation bundles data and methods, restricting direct access to internal state.' },
      { type: 'multiple_choice', question: 'Which access modifier is the most restrictive?', options: ['public', 'protected', 'private', 'default'], answer: 'private', explanation: '"private" restricts access to only within the declaring class.' },
      { type: 'multiple_choice', question: 'What is a constructor?', options: ['A method that destroys objects', 'A special method called when an object is created', 'A static method', 'An interface method'], answer: 'A special method called when an object is created', explanation: 'Constructors initialize objects when they are instantiated.' },
      { type: 'multiple_choice', question: 'Can a class have multiple constructors?', options: ['No', 'Yes, through overloading', 'Only if they are private', 'Only one default constructor'], answer: 'Yes, through overloading', explanation: 'Java supports constructor overloading (same name, different parameters).' },
      { type: 'multiple_choice', question: 'What does the "this" keyword refer to?', options: ['The parent class', 'The current object instance', 'A static reference', 'The main method'], answer: 'The current object instance', explanation: '"this" refers to the current instance of the class.' },
      { type: 'multiple_choice', question: 'What is method overloading?', options: ['Same name, different parameters', 'Same name, same parameters', 'Overriding a parent method', 'Calling a method recursively'], answer: 'Same name, different parameters', explanation: 'Overloading means multiple methods with the same name but different parameter lists.' },
      { type: 'multiple_choice', question: 'Which of these is NOT a pillar of OOP?', options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'], answer: 'Compilation', explanation: 'The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.' }
    ]
  },
  'java-inheritance': {
    topic: { name: 'Java ', color: '#f89820', icon: <CodeXml size={14} /> },
    title: 'Inheritance',
    difficulty: 'intermediate',
    lesson: {
      introduction: 'Inheritance is a mechanism in which one class acquires the properties (fields and methods) of another class. It promotes code reusability and establishes a natural hierarchy between classes.',
      concepts: [
        {
          title: 'The "extends" Keyword',
          explanation: 'In Java, the "extends" keyword is used by a subclass to inherit from a superclass. Java supports single inheritance for classes, meaning a class can only extend one direct parent.'
        },
        {
          title: 'Method Overriding',
          explanation: 'Overriding occurs when a subclass provides a specific implementation for a method already defined in its superclass. The method signature (name, return type, parameters) must be identical, and the @Override annotation is recommended.'
        },
        {
          title: 'The "super" Keyword',
          explanation: 'The "super" keyword refers to the immediate parent class. It is used to call parent constructors, access parent methods that have been overridden, and reference parent fields.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'Which keyword is used for inheritance in Java?', options: ['inherits', 'extends', 'implements', 'super'], answer: 'extends', explanation: 'The "extends" keyword is used to inherit from a class in Java.' },
      { type: 'multiple_choice', question: 'What is the topmost class in Java hierarchy?', options: ['Base', 'Root', 'Object', 'Main'], answer: 'Object', explanation: 'Every class in Java implicitly extends java.lang.Object.' },
      { type: 'multiple_choice', question: 'Can a final class be inherited?', options: ['Yes', 'No', 'Only by abstract classes', 'Only in same package'], answer: 'No', explanation: 'A final class cannot be subclassed.' },
      { type: 'multiple_choice', question: 'What is method overriding?', options: ['Same method, different parameters', 'Redefining a parent method in a child', 'Calling super.method()', 'Making a method static'], answer: 'Redefining a parent method in a child', explanation: 'Overriding provides a specific implementation of a parent method in the child class.' },
      { type: 'multiple_choice', question: 'Which annotation indicates method overriding?', options: ['@Override', '@Overload', '@Inherit', '@Super'], answer: '@Override', explanation: '@Override tells the compiler you intend to override a parent method.' },
      { type: 'multiple_choice', question: 'What is multilevel inheritance?', options: ['A → B → C chain', 'A → B and A → C', 'Multiple interfaces', 'Inner classes'], answer: 'A → B → C chain', explanation: 'Multilevel inheritance is a chain: C extends B, B extends A.' },
      { type: 'multiple_choice', question: 'Are constructors inherited?', options: ['Yes, always', 'No, but called with super()', 'Only public ones', 'Only default ones'], answer: 'No, but called with super()', explanation: 'Constructors are not inherited, but a child can invoke a parent constructor via super().' },
      { type: 'multiple_choice', question: 'What does "super" refer to?', options: ['The current class', 'The parent class', 'The Object class', 'A static context'], answer: 'The parent class', explanation: '"super" refers to the immediate parent class.' },
      { type: 'multiple_choice', question: 'Can you override a static method?', options: ['Yes', 'No, they are hidden', 'Only with @Override', 'Only in abstract classes'], answer: 'No, they are hidden', explanation: 'Static methods belong to the class, so they are hidden rather than overridden.' },
      { type: 'multiple_choice', question: 'Does Java support multiple class inheritance?', options: ['Yes', 'No', 'Only with interfaces', 'Only in Java 17+'], answer: 'No', explanation: 'Java does not support multiple class inheritance to avoid the diamond problem.' }
    ]
  },
  'java-interfaces': {
    topic: { name: 'Java ', color: '#f89820', icon: <CodeXml size={14} /> },
    title: 'Interfaces',
    difficulty: 'intermediate',
    lesson: {
      introduction: 'Interfaces in Java define a contract that classes must follow. They allow for multiple inheritance of type and are fundamental to designing flexible and decoupled systems.',
      concepts: [
        {
          title: 'Implementing Interfaces',
          explanation: 'Classes use the "implements" keyword to agree to the contract of an interface. A class can implement multiple interfaces, which is Java\'s way of supporting multiple inheritance of type.'
        },
        {
          title: 'Default and Static Methods',
          explanation: 'Since Java 8, interfaces can have default methods (with a body) and static methods, allowing for method evolution without breaking existing implementations.'
        },
        {
          title: 'Functional Interfaces',
          explanation: 'A functional interface has exactly one abstract method and can be used with lambda expressions. The @FunctionalInterface annotation enforces this constraint.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'What is an interface in Java?', options: ['A class with only static methods', 'A contract specifying methods to implement', 'An abstract class with constructors', 'A design pattern'], answer: 'A contract specifying methods to implement', explanation: 'An interface defines a contract that implementing classes must fulfill.' },
      { type: 'multiple_choice', question: 'Which keyword is used to implement an interface?', options: ['extends', 'implements', 'inherits', 'uses'], answer: 'implements', explanation: 'Classes use "implements" to adopt an interface.' },
      { type: 'multiple_choice', question: 'Can a class implement multiple interfaces?', options: ['No', 'Yes', 'Only two', 'Only if abstract'], answer: 'Yes', explanation: 'Java allows a class to implement multiple interfaces.' },
      { type: 'multiple_choice', question: 'Are interface methods public by default?', options: ['Yes', 'No, private', 'No, protected', 'No modifier'], answer: 'Yes', explanation: 'Interface methods are implicitly public and abstract (pre-Java 8).' },
      { type: 'multiple_choice', question: 'Can interfaces have default methods?', options: ['No, never', 'Yes, since Java 8', 'Only in abstract classes', 'Only static'], answer: 'Yes, since Java 8', explanation: 'Java 8 introduced default methods in interfaces with a body.' },
      { type: 'multiple_choice', question: 'Can an interface have instance variables?', options: ['Yes', 'No, only constants', 'Only private', 'Only protected'], answer: 'No, only constants', explanation: 'Interface fields are implicitly public, static, and final.' },
      { type: 'multiple_choice', question: 'What is a marker interface?', options: ['One method', 'No methods', 'Functional', 'Deprecated'], answer: 'No methods', explanation: 'A marker interface has no methods (e.g., Serializable).' },
      { type: 'multiple_choice', question: 'What is a functional interface?', options: ['Many methods', 'Exactly one abstract method', 'Any in java.util', 'Deprecated'], answer: 'Exactly one abstract method', explanation: 'A functional interface has exactly one abstract method, usable with lambdas.' },
      { type: 'multiple_choice', question: 'Can an interface extend another interface?', options: ['No', 'Yes, using extends', 'Yes, using implements', 'Only abstract'], answer: 'Yes, using extends', explanation: 'Interfaces can extend other interfaces using "extends".' },
      { type: 'multiple_choice', question: 'What annotation marks a functional interface?', options: ['@Interface', '@Functional', '@FunctionalInterface', '@Lambda'], answer: '@FunctionalInterface', explanation: '@FunctionalInterface ensures the interface has exactly one abstract method.' }
    ]
  },
  'cpp-pointers': {
    topic: { name: 'C++ ', color: '#00599C', icon: <CodeXml size={14} /> },
    title: 'Pointers',
    difficulty: 'advanced',
    lesson: {
      introduction: 'Pointers are variables that store memory addresses. They are one of the most powerful and dangerous features in C++, allowing for direct memory manipulation and dynamic memory allocation.',
      concepts: [
        {
          title: 'Dereferencing and Address-of',
          explanation: 'The "&" operator gets the memory address of a variable. The "*" operator dereferences a pointer, allowing you to access or modify the value stored at that address.'
        },
        {
          title: 'Dynamic Memory (new/delete)',
          explanation: 'The "new" operator allocates memory on the heap and returns a pointer. You must use "delete" to free this memory, otherwise you cause a memory leak.'
        },
        {
          title: 'Pointer Arithmetic',
          explanation: 'You can perform arithmetic on pointers. Adding 1 to an int pointer advances it by sizeof(int) bytes. This is how arrays and pointer traversal work under the hood.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'What is a pointer in C++?', options: ['A variable storing a value', 'A variable storing a memory address', 'A function reference', 'An array index'], answer: 'A variable storing a memory address', explanation: 'A pointer holds the memory address of another variable.' },
      { type: 'multiple_choice', question: 'Which operator gets the address of a variable?', options: ['*', '&', '->', '::'], answer: '&', explanation: 'The address-of operator "&" returns the memory address.' },
      { type: 'multiple_choice', question: 'What does the * operator do with pointers?', options: ['Multiplies', 'Dereferences the pointer', 'Declares a reference', 'Creates an array'], answer: 'Dereferences the pointer', explanation: 'The dereference operator "*" accesses the value at the pointed address.' },
      { type: 'multiple_choice', question: 'What is a null pointer?', options: ['A pointer to 0', 'Points to nothing/invalid', 'Uninitialized', 'Void pointer'], answer: 'Points to nothing/invalid', explanation: 'A null pointer (nullptr) points to no valid memory location.' },
      { type: 'multiple_choice', question: 'What is pointer arithmetic?', options: ['Adding two pointers', 'Math on addresses based on type size', 'Multiplying pointers', 'Comparing pointers'], answer: 'Math on addresses based on type size', explanation: 'Pointer arithmetic adjusts the address by the size of the pointed-to type.' },
      { type: 'multiple_choice', question: 'What is a dangling pointer?', options: ['Null pointer', 'Points to freed memory', 'Points to global', 'Const pointer'], answer: 'Points to freed memory', explanation: 'A dangling pointer references memory that has been deallocated.' },
      { type: 'multiple_choice', question: 'What does "new" do in C++?', options: ['Creates stack variable', 'Allocates memory on heap', 'Declares pointer', 'Initializes array'], answer: 'Allocates memory on heap', explanation: '"new" dynamically allocates memory on the heap.' },
      { type: 'multiple_choice', question: 'What must you do after using "new"?', options: ['Nothing', 'Use "delete"', 'Set to null', 'Call free()'], answer: 'Use "delete"', explanation: 'Memory allocated with "new" must be freed with "delete".' },
      { type: 'multiple_choice', question: 'What is a void pointer?', options: ['Null pointer', 'Points to any data type', 'Function pointer', 'Invalid pointer'], answer: 'Points to any data type', explanation: 'void* is a generic pointer that can hold the address of any type.' },
      { type: 'multiple_choice', question: 'What is the -> operator used for?', options: ['Dereferencing value', 'Accessing member through pointer', 'Comparing pointers', 'Casting pointer'], answer: 'Accessing member through pointer', explanation: '"->" accesses a member of an object through a pointer.' }
    ]
  },
  'cpp-linked-lists': {
    topic: { name: 'C++ ', color: '#00599C', icon: <CodeXml size={14} /> },
    title: 'Linked Lists',
    difficulty: 'intermediate',
    lesson: {
      introduction: 'A linked list is a linear data structure where elements are stored in nodes. Each node points to the next node in the sequence, allowing for efficient insertions and deletions.',
      concepts: [
        {
          title: 'Nodes and Pointers',
          explanation: 'A node contains data and a pointer to the next node. In a doubly linked list, it also contains a pointer to the previous node, allowing bidirectional traversal.'
        },
        {
          title: 'Memory Management',
          explanation: 'Because nodes are dynamically allocated with "new", you must manually free the memory for each node with "delete" when removing it from the list to prevent memory leaks.'
        },
        {
          title: 'Time Complexity',
          explanation: 'Insertion/deletion at the head is O(1). Searching is O(n) because you must traverse the list. This contrasts with arrays, which have O(1) access but O(n) insertion.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'What is a linked list?', options: ['Contiguous array', 'Chain of nodes connected by pointers', 'Hash table', 'Binary tree'], answer: 'Chain of nodes connected by pointers', explanation: 'A linked list is a sequence of nodes where each points to the next.' },
      { type: 'multiple_choice', question: 'What does a singly linked list node contain?', options: ['Only data', 'Data and next pointer', 'Data and two pointers', 'Only a pointer'], answer: 'Data and next pointer', explanation: 'Each node stores data and a "next" pointer.' },
      { type: 'multiple_choice', question: 'Time complexity of inserting at head?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 'O(1)', explanation: 'Inserting at the head only requires updating one pointer.' },
      { type: 'multiple_choice', question: 'Time complexity of searching?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(n)', explanation: 'You may need to traverse all nodes.' },
      { type: 'multiple_choice', question: 'What indicates the end of the list?', options: ['Node with value 0', 'nullptr in next pointer', 'Special end node', 'Size field'], answer: 'nullptr in next pointer', explanation: 'The last node\'s next pointer is nullptr.' },
      { type: 'multiple_choice', question: 'What is a doubly linked list?', options: ['Two heads', 'Next and prev pointers', 'Two separate lists', 'Circular list'], answer: 'Next and prev pointers', explanation: 'Doubly linked lists have both "next" and "previous" pointers.' },
      { type: 'multiple_choice', question: 'What is a circular linked list?', options: ['Loops infinitely', 'Last node points to first', 'Doubly linked', 'No head'], answer: 'Last node points to first', explanation: 'The tail\'s next points back to the head.' },
      { type: 'multiple_choice', question: 'How do you delete the head node?', options: ['Set head to null', 'Move head to next, delete old', 'Delete last node', 'Cannot delete'], answer: 'Move head to next, delete old', explanation: 'Save old head, advance head pointer, then free the old head.' },
      { type: 'multiple_choice', question: 'Advantage over arrays?', options: ['Faster random access', 'Dynamic size, efficient inserts', 'Less memory', 'Better cache'], answer: 'Dynamic size, efficient inserts', explanation: 'Linked lists grow dynamically and allow O(1) insertion/deletion.' },
      { type: 'multiple_choice', question: 'What is a memory leak here?', options: ['Losing head', 'Not freeing removed nodes', 'Too many nodes', 'Circular refs'], answer: 'Not freeing removed nodes', explanation: 'Failing to "delete" removed nodes causes memory leaks.' }
    ]
  },
  'calc-limits': {
    topic: { name: 'Calculus ', color: '#e74c3c', icon: <SquareFunction size={14} /> },
    title: 'Limits & Continuity',
    difficulty: 'beginner',
    lesson: {
      introduction: 'Limits are the foundation of calculus. They describe the value a function approaches as the input approaches some value. Understanding limits unlocks derivatives, integrals, and the entire study of continuous change.',
      concepts: [
        {
          title: 'The Intuitive Idea of a Limit',
          explanation: 'The limit of f(x) as x approaches c is L, written lim(x→c) f(x) = L, if f(x) gets arbitrarily close to L as x gets close to c. Crucially, the actual value f(c) does not matter — only the behavior near c.'
        },
        {
          title: 'One-Sided Limits',
          explanation: 'A left-hand limit (x→c⁻) considers values approaching from below, while a right-hand limit (x→c⁺) considers values from above. The two-sided limit exists only if both one-sided limits exist and are equal.'
        },
        {
          title: 'Continuity at a Point',
          explanation: 'A function f is continuous at x = c if three conditions hold: (1) f(c) is defined, (2) lim(x→c) f(x) exists, and (3) lim(x→c) f(x) = f(c). If any condition fails, there is a discontinuity.'
        },
        {
          title: 'Limit Laws',
          explanation: 'If lim f(x) and lim g(x) both exist, then limits obey algebraic rules: the limit of a sum is the sum of the limits, the limit of a product is the product of the limits, and so on. These let you evaluate limits without a graph.'
        }
      ]
    },
    questions: [
      { type: 'multiple_choice', question: 'What does a limit describe?', options: ['The maximum value of a function', 'The value a function approaches as input nears a point', 'The derivative at a point', 'The area under a curve'], answer: 'The value a function approaches as input nears a point', explanation: 'A limit describes the behavior of f(x) as x approaches a specific value.' },
      { type: 'multiple_choice', question: 'What is lim(x→0) sin(x)/x?', options: ['0', '1', '∞', 'undefined'], answer: '1', explanation: 'This is a fundamental limit in calculus: sin(x)/x → 1 as x → 0.' },
      { type: 'multiple_choice', question: 'When does a two-sided limit NOT exist?', options: ['When the function is continuous', 'When left and right limits disagree', 'When the function equals 0', 'When x is positive'], answer: 'When left and right limits disagree', explanation: 'If lim(x→c⁻) ≠ lim(x→c⁺), the two-sided limit does not exist.' },
      { type: 'multiple_choice', question: 'What is lim(x→∞) 1/x?', options: ['1', '∞', '0', 'undefined'], answer: '0', explanation: 'As x grows without bound, 1/x approaches 0.' },
      { type: 'multiple_choice', question: 'Which is NOT a condition for continuity at x = c?', options: ['f(c) is defined', 'lim(x→c) f(x) exists', 'f\'(c) exists', 'lim(x→c) f(x) = f(c)'], answer: 'f\'(c) exists', explanation: 'Differentiability is not required for continuity — only the three limit-based conditions.' },
      { type: 'multiple_choice', question: 'What is L\'Hôpital\'s Rule used for?', options: ['Finding derivatives', 'Evaluating 0/0 or ∞/∞ indeterminate forms', 'Integration by parts', 'Solving differential equations'], answer: 'Evaluating 0/0 or ∞/∞ indeterminate forms', explanation: 'L\'Hôpital\'s Rule applies to indeterminate forms by differentiating numerator and denominator.' },
      { type: 'multiple_choice', question: 'What does the Squeeze Theorem state?', options: ['If f ≤ g ≤ h and f,h → L, then g → L', 'Compressing a function', 'Finding bounds for integrals', 'A method for series convergence'], answer: 'If f ≤ g ≤ h and f,h → L, then g → L', explanation: 'The Squeeze Theorem pins a function between two others that share the same limit.' },
      { type: 'multiple_choice', question: 'What type of discontinuity is a "hole" in a graph?', options: ['Jump', 'Infinite', 'Removable', 'Oscillating'], answer: 'Removable', explanation: 'A removable discontinuity occurs when the limit exists but f(c) is undefined or different.' },
      { type: 'multiple_choice', question: 'What is lim(x→2) (x² - 4)/(x - 2)?', options: ['0', '2', '4', 'undefined'], answer: '4', explanation: 'Factor to (x-2)(x+2)/(x-2) = x+2 → 4 as x → 2.' },
      { type: 'multiple_choice', question: 'If lim(x→3⁻) f(x) = 5 and lim(x→3⁺) f(x) = 5, what is lim(x→3) f(x)?', options: ['Does not exist', '5', '10', 'Cannot be determined'], answer: '5', explanation: 'When both one-sided limits exist and are equal, the two-sided limit equals that value.' }
    ]
  }
};

export default function Learn() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const assignment = assignments[lessonId];
  const topic = assignment?.topic;

  const [phase, setPhase] = useState('study');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [expandedConcept, setExpandedConcept] = useState(0);

  useEffect(() => {
    if (!assignment) navigate('/dashboard');
  }, [assignment, navigate]);

  if (!assignment) return null;

  const totalQ = assignment.questions.length;
  const q = assignment.questions[currentQ];
  const isCorrect = selected === q.answer;
  const progressPct = phase === 'study' ? 0 : ((currentQ + (checked ? 1 : 0)) / totalQ) * 100;

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selected,
        correct: q.answer,
        isCorrect: selected === q.answer,
        explanation: q.explanation,
        options: q.options,
      },
    ]);
  }

  function handleNext() {
    if (currentQ + 1 >= totalQ) {
      const lastAnswer = {
        question: q.question,
        selected,
        correct: q.answer,
        isCorrect: selected === q.answer,
        explanation: q.explanation,
        options: q.options,
      };
      const alreadySaved = answers.some((a) => a.question === q.question);
      const finalAnswers = alreadySaved ? answers : [...answers, lastAnswer];
      const attemptId = `attempt-${Date.now()}`;
      const attemptData = {
        id: attemptId,
        lessonId,
        lessonTitle: assignment.title,
        topicName: topic.name,
        topicColor: topic.color,
        difficulty: assignment.difficulty,
        answers: finalAnswers,
        timestamp: new Date().toISOString(),
      };
      try {
        localStorage.setItem(attemptId, JSON.stringify(attemptData));
      } catch {
        // private-mode/quota: still navigate with state backup below
      }
      navigate(`/results/${attemptId}`, { state: { attempt: attemptData } });
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  return (
    <div className="learn-page">
      <div className="learn-topbar">
        <button className="back-btn" onClick={() => navigate('/library')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="learn-topbar-info">
          <span className="learn-topic-badge" style={{ background: topic.color + '22', color: topic.color }}>
            <span className="badge-icon" style={{ color: topic.color }}>{topic.icon}</span>
            {topic.name}
          </span>
          <span className="learn-lesson-title">{assignment.title}</span>
        </div>
        <span className="learn-counter">
          {phase === 'study' ? 'Study Material' : `${currentQ + 1} / ${totalQ}`}
        </span>
      </div>

      <div className="learn-progress-track">
        <div className="learn-progress-fill" style={{ width: `${progressPct}%`, background: topic.color }} />
      </div>

      {phase === 'study' && (
        <div className="study-card">
          <div className="study-header">
            <h1 className="study-title">{assignment.title}</h1>
            <span className="difficulty-badge" style={{ background: topic.color + '22', color: topic.color }}>
              {assignment.difficulty}
            </span>
          </div>
          <p className="study-intro">{assignment.lesson.introduction}</p>

          <h3 className="concepts-heading">Key Concepts</h3>
          <div className="concepts-list">
            {assignment.lesson.concepts.map((concept, i) => (
              <div
                key={i}
                className={`concept-item ${expandedConcept === i ? 'expanded' : ''}`}
                onClick={() => setExpandedConcept(expandedConcept === i ? -1 : i)}
                >
                <div className="concept-header">
                    <span className="concept-bullet" style={{ background: topic.color }}></span>
                    <span className="concept-title">{concept.title}</span>
                    {expandedConcept === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                <div className={`concept-body ${expandedConcept === i ? 'open' : ''}`}>
                    <div className="concept-body-inner">
                    <p className="concept-explanation">{concept.explanation}</p>
                    </div>
                </div>
                </div>
            ))}
          </div>

          <button
            className="start-quiz-btn"
            onClick={() => setPhase('quiz')}
            style={{ background: topic.color }}
          >
            Start Quiz →
          </button>
        </div>
      )}

      {phase === 'quiz' && (
        <div
            className="question-card"
            key={currentQ}
            style={{ '--accent': topic.color }}
        >
          <div className="question-number">Question {currentQ + 1}</div>
          <h2 className="question-text">{q.question}</h2>

          <div className="options-list">
            {q.options.map((opt, i) => {
              let cls = 'option-btn';
              if (checked) {
                if (opt === q.answer) cls += ' correct';
                else if (opt === selected && !isCorrect) cls += ' wrong';
              } else if (opt === selected) {
                cls += ' selected';
              }

              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => !checked && setSelected(opt)}
                  disabled={checked}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="option-text">{opt}</span>
                  {checked && opt === q.answer && <Check size={18} className="option-icon" />}
                  {checked && opt === selected && !isCorrect && <X size={18} className="option-icon" />}
                </button>
              );
            })}
          </div>

          {checked && (
            <div className={`explanation ${isCorrect ? 'correct' : 'wrong'}`}>
              <strong>{isCorrect ? '🎉 Correct!' : '❌ Not quite.'}</strong>
              <p>{q.explanation}</p>
            </div>
          )}

          <div className="question-actions">
            {!checked ? (
              <button
                className="check-btn"
                onClick={handleCheck}
                disabled={!selected}
                style={{ background: topic.color }}
              >
                Check Answer
              </button>
            ) : (
              <button
                className="next-btn"
                onClick={handleNext}
                style={{ background: topic.color }}
              >
                {currentQ + 1 >= totalQ ? 'See Results →' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}