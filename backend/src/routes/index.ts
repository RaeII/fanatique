import { Router } from "express";

import wallet from './wallet.routes'
import user from './user.routes'
import club from './club.routes'
import stadium from './stadium.routes'
import match from './match.routes'
import product from './product.routes'
import quest from './quest.routes'
import questUser from './quest-user.routes'
import contract from './contract.routes'
import userClubToken from './userClubToken.routes'
import transaction from './transaction.routes'
import stablecoin from './stablecoin.routes'
import odds from './odds.routes'
import userBet from './user-bet.routes'
import userChips from './user-chips.routes'

const apiRouter = Router();

apiRouter.use("/wallet", wallet);
apiRouter.use("/user", user);
apiRouter.use("/club", club);
apiRouter.use("/stadium", stadium);
apiRouter.use("/match", match);
apiRouter.use("/product", product);
apiRouter.use("/quest", quest);
apiRouter.use("/quest-user", questUser);
apiRouter.use("/contract", contract);
apiRouter.use("/user-club-token", userClubToken);
apiRouter.use("/transaction", transaction);
apiRouter.use("/stablecoin", stablecoin);
apiRouter.use("/odds", odds);
apiRouter.use("/user-bet", userBet);
apiRouter.use("/chips", userChips);

export default apiRouter;