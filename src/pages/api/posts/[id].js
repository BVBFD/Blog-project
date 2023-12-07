import dbConnect from '@/utils/db.js';
import PostDatasModel from '../../../../models/postDatasModel';

export default async function handler(req, res) {
  const {
    method,
    params: { id },
    query: { meta },
  } = req;

  try {
    await dbConnect();
  } catch (error) {
    res.status(500).json(error);
  }

  if (method === 'GET') {
    try {
      const foundPost = await PostDatasModel.findById(id);

      if (!foundPost) {
        return res.status(404).json('Post not found');
      }

      if (meta) {
        // toObject() 메서드
        // 마치 마술사가 있는 상자를 다른 상자로 바꾸는 것처럼 생각해봅시다.

        // .toObject()는 Mongoose에서 가져온 상자(인스턴스)를 더 예쁜 상자(JavaScript 객체)로 바꿔줍니다.
        // 그 예쁜 상자 안에는 특별한 것들이 추가로 들어갈 수 있어요. 예를 들어, 덧셈이나 뺄셈을 하거나 다른 정보를 추가할 수 있어요.

        // _doc 프러퍼티
        // 이번에는 마술사가 있는 상자(인스턴스)를 그냥 같은 모양의 다른 상자(JavaScript 객체)로 바꾸는 것처럼 생각해봅시다.
        // ._doc은 특별한 처리 없이 그냥 같은 내용물의 상자를 주는 것이에요. 특별한 변화 없이 그냥 필요한 정보만 그대로 가져와요.
        const { text, catName, author, createdAt, updatedAt, ...others } = foundPost.toObject();

        // 쉽게 말하면, .toObject()는 뭔가 변화를 주고 싶을 때 사용하는 메서드이고,
        // ._doc은 그냥 필요한 정보만 가져오고 싶을 때 사용하는 프로퍼티입니다.
        res.status(200).json(others);
      } else {
        res.status(200).json(foundPost);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === 'PUT') {
    try {
      const foundPost = await PostDatasModel.findById(id);

      if (!foundPost) {
        return res.status(404).json('Post not found');
      }

      if (req.body.author === foundPost.author) {
        const updatedPost = await PostDatasModel.findByIdAndUpdate(id, req.body, { returnOriginal: false });

        res.status(201).json(updatedPost);
      } else {
        res.status(401).json('You can update and delete your own posts!');
      }
    } catch (err) {
      res.status(401).json(err);
    }
  }

  if (method === 'DELETE') {
    try {
      const foundPost = await PostDatasModel.findById(id);

      if (!foundPost) {
        return res.status(404).json('Post not found');
      }

      if (req.body.author === foundPost.author) {
        await foundPost.remove();
        res.status(204).json('The Post has been deleted!');
      } else {
        res.status(404).json('You can update and delete your own posts!');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
