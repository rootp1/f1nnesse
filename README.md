

# F!nesse Bet

F!nesse Bet is a decentralized sports betting platform designed for inter-bhawan sports competitions at IIT Roorkee. Built on blockchain technology, F!nesse Bet ensures transparency, trust, and security while providing a decentralized betting experience.

## Features

- **Transparency & Trust**: Blockchain ensures that all transactions, bets, and results are publicly verifiable and immutable.
- **Decentralization**: Eliminates centralized control, ensuring no entity can manipulate funds or results.
- **Efficiency**: Allows fractional betting in ETH (as low as 0.0001 ETH), making the platform accessible to all.
- **Community Engagement**: Live leaderboards and betting updates create excitement during sports events.
- **Revenue Generation**: 10% of the pool goes to the platform owner, while 90% is distributed among the winning bettors.

## Getting Started

### Prerequisites

To run this project locally, make sure you have the following tools installed:

- Node.js (LTS version)
- npm (or yarn)
- MetaMask or any Web3-enabled browser extension
- Solidity (for smart contract development)
- Ethereum test network (e.g., Rinkeby, Kovan)
- Firebase (for user authentication and data storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finesse-bet.git
   cd finesse-bet
   

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root of the project and configure the necessary keys (e.g., Firebase API keys, Ethereum network settings).

4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Features

### 1. **Get Started Button & Google Authentication**
   - The "Get Started" button redirects users to the login page.
   - Users can log in via Google Authentication.
   - After successful login, users are redirected to the main platform where they can view matches, place bets, etc.

### 2. **Learn More Button**
   - The "Learn More" button opens a small card that overlaps the page and blurs the background.
   - The card contains information about the platform and its features.

### 3. **Match Listing and Adding**
   - Admin users can add new matches through an input form.
   - The input form includes fields for team names, time, venue, and match type (sport name).
   - After submitting the form, the match is added to the upcoming matches list.

### 4. **Upcoming Matches Display**
   - Matches are displayed as cards, showing the sport name, date, teams, venue, and time.
   - These cards are dynamically updated and visible to all users.

### 5. **Place Bet Section**
   - A similar card format as the "Upcoming Matches" section is used for placing bets.
   - Each card includes an input field for entering the bet amount and a submit button to place the bet.

### 6. **Admin Panel**
   - Admin login functionality with a predefined username and password stored in the database.
   - Admins can upload match results, and these results will be automatically displayed in the match cards.
   - Role-based access control (RBAC) is used to secure admin actions.

### 7. **Login Options**
   - On clicking "Get Started," users can choose to log in as a "User" or "Admin."
   - Users can log in via Google Authentication.
   - Admin users log in using a predefined username and password stored in the Firebase database.

## Technologies Used

- **Frontend**: React (Next.js), TypeScript, Web3.js, Firebase Authentication, TailwindCSS
- **Backend**: Firebase Firestore (for match data storage and user management)
- **Blockchain**: Ethereum, Solidity (for smart contract development)
- **Smart Contracts**: OpenZeppelin (for security best practices)
- **Authentication**: Google OAuth (for user login), Firebase Authentication
- **Styling**: TailwindCSS

## How It Works

- **Frontend**: The frontend uses Next.js for building the UI, and Web3.js is used to interact with the Ethereum blockchain for placing bets and verifying transactions.
- **Smart Contracts**: Smart contracts are deployed on the Ethereum test network (e.g., Rinkeby) for decentralized betting.
- **Database**: Firebase Firestore stores match data, bet history, and user information, including admin credentials.
- **Authentication**: Users can authenticate via Google, while admins can log in using a predefined username and password.

## Running the Project

To run the project locally:

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/finesse-bet.git
   cd finesse-bet
   npm install
   ```

2. Set up the required environment variables for Firebase and Ethereum network:
   - Create a `.env` file and add the necessary Firebase API keys and Ethereum settings.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the app in your browser at `http://localhost:3000`.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request. Please ensure that your code adheres to the existing style and includes tests where applicable.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to your branch (`git push origin feature/your-feature-name`).
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to check the repository for updates and feel free to create issues or contribute to make this platform even better.
```

Save this content in the `README.md` file in your GitHub repository. This format includes all the necessary instructions for setting up the project, details about features, and contribution guidelines.
