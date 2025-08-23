import { Button } from "@/components/ui/button";


export function PublishButton({publishDraft}) {
  return (
    <Button
    onClick={publishDraft}
    >
        Publish
    </Button>
  )
}

