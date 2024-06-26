import apiClient from "../../utils/apiClient.js";

// ! func: initiateTransfer (3 params)
// ? req, res
// * CRUD type: post
// * return value: null

export const initiateTransfer = async (req, res) => {
  const { senderWallet, receiverWallet, tokens, bundleSize } = req.body;

  try {
    const data = await apiClient.post("/auth", {
      wallet: `${process.env.MAIN_WALLET_NAME}`,
      password: `${process.env.MAIN_WALLET_PASSWORD}`,
    });

    apiClient.defaults.headers.common["TREETRACKER_API_KEY"] =
      process.env.MAIN_WALLET_API_KEY;

    const { token } = data.data;

    apiClient.setAuthToken(token);
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: err,
    });
  }

  let transferData;

  if (tokens) {
    transferData = {
      tokens,
      sender_wallet: senderWallet,
      receiver_wallet: receiverWallet,
      claim: false,
    };
  } else if (bundleSize) {
    transferData = {
      bundle: { bundle: bundleSize },
      sender_wallet: senderWallet,
      receiver_wallet: receiverWallet,
      claim: false,
    };
  } else {
    return res.status(400).send({ error: "Invalid transfer data!" });
  }

  try {
    const transfer = await apiClient.post("/transfers", transferData);

    console.log(transfer);
    return res.status(200).send({ data: transfer.data });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: err,
    });
  }
};
